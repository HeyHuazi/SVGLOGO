import { readdir, writeFile, stat, readFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';
import * as YAML from 'yaml';

// 配置
const SVGS_FILE = join(process.cwd(), 'src/data/svgs.ts');
const LIBRARY_DIR = join(process.cwd(), 'static/library');

// 从路径提取文件名
function extractFileName(path: string | any): string | any {
  if (typeof path === 'string') {
    return basename(path);
  }
  
  if (typeof path === 'object') {
    const result: any = {};
    if (path.dark) result.dark = basename(path.dark);
    if (path.light) result.light = basename(path.light);
    return result;
  }
  
  return path;
}

// 从 route 提取文件夹名
function extractFolder(route: string): string {
  // /library/company/xiaomi.svg → company
  const parts = route.split('/');
  
  // 处理特殊情况：/library/xxx.svg（没有分类文件夹）
  if (parts.length === 3) {
    console.log(`  ⚠️  特殊路径: ${route} → 归类到 other`);
    return 'other';
  }
  
  return parts.length > 2 ? parts[2] : 'other';
}

// 解析 svgs.ts 文件
async function parseSvgsFile(): Promise<any[]> {
  const content = await readFile(SVGS_FILE, 'utf-8');
  
  // 提取数组部分
  const match = content.match(/export const svgs[^=]*=\s*\[([\s\S]*)\];/);
  if (!match) {
    throw new Error('无法解析 svgs.ts 文件');
  }
  
  // 使用 Function 构造器安全地解析
  const code = `return [${match[1]}];`;
  const svgs = new Function(code)();
  
  return svgs;
}

// 生成 YAML 内容（保留原始顺序，添加 order 字段）
function generateYaml(svgs: any[], order: number): string {
  const items = svgs.map(svg => {
    const item: any = {
      title: svg.title,
      file: extractFileName(svg.route),
      url: svg.url
    };
    
    if (svg.wordmark) {
      item.wordmark = extractFileName(svg.wordmark);
    }
    
    return item;
  });
  
  const meta = { 
    order,  // 添加顺序字段
    items 
  };
  
  return YAML.stringify(meta, {
    lineWidth: 0,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN'
  });
}

// 主函数
async function main() {
  console.log('🔄 开始迁移...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 解析现有的 svgs.ts
  console.log('📖 读取 src/data/svgs.ts...');
  const svgs = await parseSvgsFile();
  console.log(`  找到 ${svgs.length} 个图标\n`);
  
  // 按文件夹分组（保留原始顺序）
  const groups = new Map<string, any[]>();
  const folderOrder = [];  // 记录分类出现的顺序
  
  for (const svg of svgs) {
    // 从 route 提取文件夹名
    const route = typeof svg.route === 'string' ? svg.route : svg.route.dark || svg.route.light;
    const folder = extractFolder(route);
    
    if (!groups.has(folder)) {
      groups.set(folder, []);
      folderOrder.push(folder);  // 记录首次出现的顺序
    }
    
    groups.get(folder)!.push(svg);
  }
  
  console.log(`📂 发现 ${groups.size} 个分类\n`);
  console.log('📋 分类顺序:');
  folderOrder.forEach((folder, index) => {
    const count = groups.get(folder).length;
    console.log(`  ${index + 1}. ${folder} (${count} 条)`);
  });
  console.log('');
  
  // 为每个分类生成 _meta.yaml（保留原始顺序，添加 order 字段）
  for (const folder of folderOrder) {
    const items = groups.get(folder);
    const order = folderOrder.indexOf(folder) + 1;  // 顺序从 1 开始
    
    const categoryDir = join(LIBRARY_DIR, folder);
    
    // 确保目录存在
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }
    
    // 生成 YAML（包含 order 字段）
    const yamlContent = generateYaml(items, order);
    const yamlFile = join(categoryDir, '_meta.yaml');
    
    await writeFile(yamlFile, yamlContent, 'utf-8');
    
    console.log(`✅ ${folder}/_meta.yaml (order: ${order}, ${items.length} 条)`);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 迁移完成！');
  console.log(`\n下一步:`);
  console.log(`  1. 运行 pnpm generate:svg 验证生成结果`);
  console.log(`  2. 对比 src/data/svgs.ts 的差异`);
  console.log(`  3. 提交更改`);
}

main().catch(console.error);
