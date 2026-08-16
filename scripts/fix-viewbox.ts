/**
 * [INPUT]: 依赖 node:fs/promises 与 static/library 的 SVG 资产
 * [OUTPUT]: 对外提供 viewBox 修复——为缺失 viewBox 的 SVG 依据 width/height 补齐
 * [POS]: scripts 的资产规范化工具，按需手动执行，替代旧 fix-viewbox 子包
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const LIBRARY_DIR = join(process.cwd(), 'static/library');

const attr = (content: string, name: string) =>
  new RegExp(`${name}="(.+?)"`).exec(content)?.[1] ?? null;

async function* walkSvgs(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkSvgs(path);
    else if (entry.name.endsWith('.svg')) yield path;
  }
}

async function main() {
  let fixed = 0;
  let skipped = 0;

  for await (const path of walkSvgs(LIBRARY_DIR)) {
    const content = await readFile(path, 'utf-8');
    if (attr(content, 'viewBox')) {
      skipped++;
      continue;
    }

    const width = attr(content, 'width');
    const height = attr(content, 'height');
    if (!width || !height) {
      console.warn(`⚠️ 无法修复（缺 width/height）: ${path}`);
      continue;
    }

    await writeFile(path, content.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`));
    console.log(`🔔 已修复: ${path.replace(LIBRARY_DIR + '/', '')}`);
    fixed++;
  }

  console.log(`🚀 完成：修复 ${fixed} 个，跳过 ${skipped} 个（已有 viewBox）`);
}

main();
