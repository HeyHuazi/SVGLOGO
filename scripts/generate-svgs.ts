import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, basename } from 'path';
import { existsSync } from 'fs';
import * as YAML from 'yaml';

// 配置
const LIBRARY_DIR = join(process.cwd(), 'static/library');
const OUTPUT_FILE = join(process.cwd(), 'src/data/svgs.ts');

// 文件夹名 → 分类名映射
const FOLDER_TO_CATEGORY: Record<string, string> = {
  'aigc': 'AI产品',
  'airline': '航空公司',
  'automotive': '汽车品牌',
  'company': '企业组织',
  'cosmetic': '美妆品牌',
  'goldJewelry': '黄金珠宝',
  'other': '其他',
  'pay': '金融支付',
  'school': '大学校徽',
  'social': '社交媒体',
  'tools': '工具产品',
  'university': '大学校徽',
  'consumerBrands': '消费品牌',
  'weather': '气象预警'
};

// 处理文件路径
function processRoute(file: any, categorySlug: string): string | { dark: string; light: string } {
  if (typeof file === 'string') {
    return `/library/${categorySlug}/${file}`;
  }
  
  if (typeof file === 'object') {
    return {
      dark: file.dark ? `/library/${categorySlug}/${file.dark}` : '',
      light: file.light ? `/library/${categorySlug}/${file.light}` : ''
    };
  }
  
  return '';
}

// 处理 wordmark
function processWordmark(wordmark: any, categorySlug: string): string | { dark: string; light: string } | undefined {
  if (!wordmark) return undefined;
  
  if (typeof wordmark === 'string') {
    return `/library/${categorySlug}/${wordmark}`;
  }
  
  if (typeof wordmark === 'object') {
    return {
      dark: wordmark.dark ? `/library/${categorySlug}/${wordmark.dark}` : '',
      light: wordmark.light ? `/library/${categorySlug}/${wordmark.light}` : ''
    };
  }
  
  return undefined;
}

// 读取分类的元数据
async function readCategoryMeta(categoryDir: string): Promise<{ order: number; items: any[] }> {
  const metaFile = join(categoryDir, '_meta.yaml');
  const categorySlug = basename(categoryDir);
  
  if (!existsSync(metaFile)) {
    return { order: 999, items: [] };
  }
  
  try {
    const content = await readFile(metaFile, 'utf-8');
    const meta = YAML.parse(content);
    
    if (!meta || !meta.items) {
      return { order: 999, items: [] };
    }
    
    // 从文件夹名推断分类
    const category = FOLDER_TO_CATEGORY[categorySlug] || categorySlug;
    
    const items = meta.items.map((item: any) => {
      const result: any = {
        title: item.title,
        category,  // 从文件夹名推断
        route: processRoute(item.file, categorySlug),
        url: item.url || 'TODO'
      };
      
      if (item.wordmark) {
        result.wordmark = processWordmark(item.wordmark, categorySlug);
      }
      
      return result;
    });
    
    return {
      order: meta.order || 999,  // 读取 order 字段
      items
    };
  } catch (error) {
    console.log(`  ❌ 错误: ${categorySlug} - ${error}`);
    return { order: 999, items: [] };
  }
}

// 生成 TypeScript 代码
function generateTypeScript(svgs: any[]): string {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const items = svgs.map((svg, index) => {
    const parts = ['  {'];
    
    // id
    parts.push(`    id: ${index + 1},`);
    
    // title
    parts.push(`    title: "${svg.title}",`);
    
    // category
    parts.push(`    category: "${svg.category}",`);
    
    // route
    if (typeof svg.route === 'object') {
      parts.push(`    route: {`);
      parts.push(`      dark: "${svg.route.dark}",`);
      parts.push(`      light: "${svg.route.light}"`);
      parts.push(`    },`);
    } else {
      parts.push(`    route: "${svg.route}",`);
    }
    
    // wordmark
    if (svg.wordmark) {
      if (typeof svg.wordmark === 'object') {
        parts.push(`    wordmark: {`);
        parts.push(`      dark: "${svg.wordmark.dark}",`);
        parts.push(`      light: "${svg.wordmark.light}"`);
        parts.push(`    },`);
      } else {
        parts.push(`    wordmark: "${svg.wordmark}",`);
      }
    }
    
    // url
    parts.push(`    url: "${svg.url}",`);
    
    parts.push('  }');
    
    return parts.join('\n');
  });
  
  return `// 自动生成，请勿手动编辑
// Generated at: ${timestamp}
// 由 scripts/generate-svgs.ts 生成

import type { iSVG } from "../types/svg";

export const svgs: iSVG[] = [
${items.join(',\n')}
];
`;
}

// 生成分类索引 TypeScript 代码
function generateCategoriesTS(svgs: any[]): string {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  // 统计分类计数
  const counts: Record<string, number> = {};
  for (const svg of svgs) {
    const cats = Array.isArray(svg.category) ? svg.category : [svg.category];
    for (const c of cats) {
      counts[c] = (counts[c] || 0) + 1;
    }
  }

  // 显示名映射
  const displayNames: Record<string, string> = { 'AI产品': 'AI 产品' };

  // 排序：按 count 降序，"其他" 固定末尾
  const OTHER_KEY = '其他';
  const sorted = Object.keys(counts)
    .filter(c => c !== OTHER_KEY)
    .sort((a, b) => counts[b] - counts[a]);
  if (counts[OTHER_KEY]) sorted.push(OTHER_KEY);

  const entries = sorted.map(name => {
    const displayName = displayNames[name] || name;
    return `  { name: "${displayName}", slug: "${name}", count: ${counts[name]} }`;
  });

  return `// 自动生成，请勿手动编辑
// Generated at: ${timestamp}
// 由 scripts/generate-svgs.ts 生成

export interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}

export const categories: CategoryEntry[] = [
${entries.join(',\n')}
];
`;
}

// 主函数
async function main() {
  console.log('🔨 生成 svgs.ts & categories.ts...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const categories = await readdir(LIBRARY_DIR);
  const categoryData: { folder: string; order: number; items: any[] }[] = [];
  
  for (const category of categories) {
    const categoryDir = join(LIBRARY_DIR, category);
    const stats = await stat(categoryDir);
    
    if (!stats.isDirectory()) continue;
    
    const { order, items } = await readCategoryMeta(categoryDir);
    
    if (items.length > 0) {
      categoryData.push({ folder: category, order, items });
    } else {
      console.log(`  ⚠️  跳过: ${category} (缺少 _meta.yaml)`);
    }
  }
  
  // 按 order 字段排序
  categoryData.sort((a, b) => a.order - b.order);
  
  // 按 order 顺序输出
  const allSvgs: any[] = [];
  for (const { folder, order, items } of categoryData) {
    console.log(`📂 ${folder}/ (order: ${order}) → ${items.length} 个图标`);
    allSvgs.push(...items);
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 总计: ${allSvgs.length} 个图标`);
  
  // 生成 TypeScript 文件
  const code = generateTypeScript(allSvgs);
  await writeFile(OUTPUT_FILE, code, 'utf-8');
  console.log(`\n✅ 已生成: ${OUTPUT_FILE}`);

  // 生成分类索引
  const CATEGORIES_OUTPUT = join(process.cwd(), 'src/data/categories.ts');
  const categoriesCode = generateCategoriesTS(allSvgs);
  await writeFile(CATEGORIES_OUTPUT, categoriesCode, 'utf-8');
  console.log(`✅ 已生成: ${CATEGORIES_OUTPUT}`);
}

main().catch(console.error);
