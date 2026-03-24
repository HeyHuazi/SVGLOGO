import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, basename, parse } from 'path';
import { existsSync } from 'fs';
import * as YAML from 'yaml';

// 配置
const LIBRARY_DIR = join(process.cwd(), 'static/library');
const MAPPINGS_FILE = join(process.cwd(), 'scripts/title-mappings.json');

// 加载标题映射表
async function loadTitleMappings(): Promise<Record<string, string>> {
  try {
    const content = await readFile(MAPPINGS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// 从文件名提取标题
function extractTitleFromFilename(filename: string, mappings: Record<string, string>): string {
  const nameWithoutExt = parse(filename).name;
  
  // 移除 _wordmark 后缀
  const baseName = nameWithoutExt.replace(/_wordmark$/i, '');
  
  // 查找映射表
  const key = baseName.toLowerCase().replace(/[-_\s]/g, '');
  if (mappings[key]) {
    return mappings[key];
  }
  
  // 智能转换：kebab-case → Title Case
  const title = baseName
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return title;
}

// 扫描单个分类目录
async function scanCategory(
  categoryDir: string,
  mappings: Record<string, string>
): Promise<{ newItems: any[], deletedItems: string[] }> {
  const categorySlug = basename(categoryDir);
  const metaFile = join(categoryDir, '_meta.yaml');
  
  // 读取现有元数据
  let existingMeta: any = { items: [] };
  if (existsSync(metaFile)) {
    const content = await readFile(metaFile, 'utf-8');
    existingMeta = YAML.parse(content) || existingMeta;
  }
  
  // 获取所有 SVG 文件
  const files = await readdir(categoryDir);
  const svgFiles = files.filter(f => 
    f.endsWith('.svg') && !f.startsWith('.')
  );
  
  // 已记录的文件
  const recordedFiles = new Set(
    existingMeta.items.map((item: any) => {
      if (typeof item.file === 'string') return item.file;
      if (typeof item.file === 'object') {
        return [item.file.dark, item.file.light].filter(Boolean);
      }
      return null;
    }).flat().filter(Boolean)
  );
  
  // 查找新文件
  const newFiles = svgFiles.filter(f => !recordedFiles.has(f));
  
  // 查找已删除的文件
  const deletedFiles: string[] = [];
  for (const recorded of recordedFiles) {
    if (!existsSync(join(categoryDir, recorded))) {
      deletedFiles.push(recorded);
    }
  }
  
  // 生成新条目
  const newItems = newFiles
    .filter(f => !f.includes('_wordmark')) // 先添加主文件
    .map(file => {
      const title = extractTitleFromFilename(file, mappings);
      const baseName = parse(file).name;
      
      // 查找对应的 wordmark
      const wordmarkFile = svgFiles.find(f => 
        f.startsWith(baseName + '_wordmark')
      );
      
      const item: any = {
        title,
        file,
        url: 'TODO'
      };
      
      if (wordmarkFile) {
        item.wordmark = wordmarkFile;
      }
      
      return item;
    });
  
  const result = {
    newItems,
    deletedItems: deletedFiles
  };
  
  return result;
}

// 更新元数据文件
async function updateMetaFile(
  metaFile: string,
  newItems: any[]
): Promise<void> {
  // 读取现有元数据
  let existingMeta: any = { items: [] };
  
  if (existsSync(metaFile)) {
    const content = await readFile(metaFile, 'utf-8');
    existingMeta = YAML.parse(content) || existingMeta;
  }
  
  // 追加新条目
  existingMeta.items.push(...newItems);
  
  // 生成 YAML
  const yamlContent = YAML.stringify(existingMeta, {
    lineWidth: 0,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN'
  });
  
  await writeFile(metaFile, yamlContent, 'utf-8');
}

// 主函数
async function main() {
  console.log('🔍 扫描目录: static/library/');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const mappings = await loadTitleMappings();
  const categories = await readdir(LIBRARY_DIR);
  
  let totalNew = 0;
  let totalDeleted = 0;
  
  for (const category of categories) {
    const categoryDir = join(LIBRARY_DIR, category);
    const stats = await stat(categoryDir);
    
    if (!stats.isDirectory()) continue;
    
    const { newItems, deletedItems } = await scanCategory(categoryDir, mappings);
    
    if (newItems.length > 0 || deletedItems.length > 0) {
      console.log(`📂 ${category}/`);
      
      if (newItems.length > 0) {
        console.log(`  ✅ 新增: ${newItems.length} 个文件`);
        newItems.forEach(item => {
          console.log(`     → ${item.file}`);
        });
      }
      
      if (deletedItems.length > 0) {
        console.log(`  ⚠️  缺失: ${deletedItems.length} 个文件`);
        deletedItems.forEach(file => {
          console.log(`     ✗ ${file}`);
        });
      }
      
      // 更新元数据文件
      if (newItems.length > 0) {
        const metaFile = join(categoryDir, '_meta.yaml');
        await updateMetaFile(metaFile, newItems);
        console.log(`  📝 已更新: _meta.yaml`);
      }
      
      console.log('');
      totalNew += newItems.length;
      totalDeleted += deletedItems.length;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 统计:');
  console.log(`  新增: ${totalNew} 个`);
  console.log(`  缺失: ${totalDeleted} 个`);
  
  if (totalNew > 0) {
    console.log('\n⚠️  提示: 请检查 _meta.yaml 并补充必要信息（如 URL）');
  }
}

main().catch(console.error);
