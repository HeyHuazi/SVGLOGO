/*
 * [INPUT]: 依赖 static/library、分类 YAML 与 title-mappings 品牌标题映射
 * [OUTPUT]: 提供只读资产一致性检查，并在 --write 下补录孤儿 SVG 与缺失 Wordmark 关联
 * [POS]: scripts 的资产事实门禁与维护恢复工具，不参与 Admin 日常入库
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, basename, parse } from 'path';
import { existsSync } from 'fs';
import * as YAML from 'yaml';

// 配置
const LIBRARY_DIR = join(process.cwd(), 'static/library');
const MAPPINGS_FILE = join(process.cwd(), 'scripts/title-mappings.json');
const writeChanges = process.argv.includes('--write');

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
): Promise<{ newItems: any[], deletedItems: string[], updatedWordmarks: string[], duplicatedRefs: string[], updatedMeta: any }> {
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
  
  // 已记录的文件（包含 file 和 wordmark）
  const recordedFiles = new Set<string>();
  // 大小写折叠的重复引用检测（file -> 首个声明它的 title）
  const seenByLower = new Map<string, string>();
  const duplicatedRefs: string[] = [];
  for (const item of existingMeta.items) {
    const files: string[] = [];
    if (typeof item.file === 'string') {
      files.push(item.file);
    } else if (typeof item.file === 'object') {
      if (item.file.dark) files.push(item.file.dark);
      if (item.file.light) files.push(item.file.light);
    }
    if (typeof item.wordmark === 'string') files.push(item.wordmark);
    for (const f of files) {
      recordedFiles.add(f);
      const key = f.toLowerCase();
      const prev = seenByLower.get(key);
      if (prev !== undefined && prev !== item.title) {
        duplicatedRefs.push(`${f}（${prev} / ${item.title}）`);
      } else if (prev === undefined) {
        seenByLower.set(key, item.title);
      }
    }
  }
  
  // 查找新文件
  const newFiles = svgFiles.filter(f => !recordedFiles.has(f));
  
  // 查找已删除的文件（大小写敏感：用 readdir 真实列表做成员判断，
  // 避免 existsSync 在大小写不敏感文件系统上把拼错的大小写误判为存在）
  const svgFileSet = new Set(svgFiles);
  const deletedFiles: string[] = [];
  for (const recorded of recordedFiles) {
    if (!svgFileSet.has(recorded)) {
      deletedFiles.push(recorded);
    }
  }
  
  // 生成新条目（仅处理非 wordmark 的主文件）
  const newItems = newFiles
    .filter(f => !f.includes('_wordmark'))
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
  
  // 补充已有条目缺失的 wordmark
  const updatedWordmarks: string[] = [];
  const newWordmarkFiles = newFiles.filter(f => f.includes('_wordmark'));
  
  for (const wordmarkFile of newWordmarkFiles) {
    const baseName = parse(wordmarkFile).name.replace(/_wordmark$/i, '');
    const correspondingMainFile = svgFiles.find(f => 
      parse(f).name === baseName && !f.includes('_wordmark')
    );
    
    if (!correspondingMainFile) continue;
    
    // 在已有 items 中查找对应条目
    const existingItem = existingMeta.items.find((item: any) => {
      return typeof item.file === 'string' && item.file === correspondingMainFile;
    });
    
    if (existingItem && !existingItem.wordmark) {
      existingItem.wordmark = wordmarkFile;
      updatedWordmarks.push(wordmarkFile);
    }
  }
  
  return {
    newItems,
    deletedItems: deletedFiles,
    updatedWordmarks,
    duplicatedRefs,
    updatedMeta: existingMeta
  };
}

// 更新元数据文件
async function updateMetaFile(
  metaFile: string,
  newItems: any[],
  updatedMeta: any
): Promise<void> {
  // 追加新条目
  updatedMeta.items.push(...newItems);
  
  // 生成 YAML
  const yamlContent = YAML.stringify(updatedMeta, {
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
  let totalWordmarks = 0;
  let totalDuplicated = 0;
  
  for (const category of categories) {
    const categoryDir = join(LIBRARY_DIR, category);
    const stats = await stat(categoryDir);
    
    if (!stats.isDirectory()) continue;
    
    const { newItems, deletedItems, updatedWordmarks, duplicatedRefs, updatedMeta } = await scanCategory(categoryDir, mappings);
    
    if (newItems.length > 0 || deletedItems.length > 0 || updatedWordmarks.length > 0 || duplicatedRefs.length > 0) {
      console.log(`📂 ${category}/`);
      
      if (newItems.length > 0) {
        console.log(`  ✅ 新增: ${newItems.length} 个文件`);
        newItems.forEach(item => {
          console.log(`     → ${item.file}`);
        });
      }
      
      if (updatedWordmarks.length > 0) {
        console.log(`  🔗 补充 wordmark: ${updatedWordmarks.length} 个`);
        updatedWordmarks.forEach(file => {
          console.log(`     → ${file}`);
        });
      }
      
      if (deletedItems.length > 0) {
        console.log(`  ⚠️  缺失: ${deletedItems.length} 个文件`);
        deletedItems.forEach(file => {
          console.log(`     ✗ ${file}`);
        });
      }
      
      if (duplicatedRefs.length > 0) {
        console.log(`  ⚠️  重复引用（大小写折叠后冲突）: ${duplicatedRefs.length} 处`);
        duplicatedRefs.forEach(ref => {
          console.log(`     ✗ ${ref}`);
        });
      }
      
      // 更新元数据文件
      if (writeChanges && (newItems.length > 0 || updatedWordmarks.length > 0)) {
        const metaFile = join(categoryDir, '_meta.yaml');
        await updateMetaFile(metaFile, newItems, updatedMeta);
        console.log(`  📝 已更新: _meta.yaml`);
      }
      
      console.log('');
      totalNew += newItems.length;
      totalDeleted += deletedItems.length;
      totalWordmarks += updatedWordmarks.length;
      totalDuplicated += duplicatedRefs.length;
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 统计:');
  console.log(`  新增: ${totalNew} 个`);
  console.log(`  缺失: ${totalDeleted} 个`);
  console.log(`  待关联 Wordmark: ${totalWordmarks} 个`);
  console.log(`  重复引用: ${totalDuplicated} 处`);
  
  if (totalNew > 0) console.log('\n⚠️  提示: 请检查 _meta.yaml 并补充必要信息（如 URL）');
  if (totalDuplicated > 0) console.log('\nℹ️  提示: 存在重复引用（同一文件被多条目共享，如预警图标别名），不影响校验结果');
  if (!writeChanges && (totalNew > 0 || totalDeleted > 0 || totalWordmarks > 0)) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
