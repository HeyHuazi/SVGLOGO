/**
 * [INPUT]: 依赖 node:fs/promises 与 static/library 的 SVG 资产
 * [OUTPUT]: 对外提供 SVG 尺寸门禁——超过共享 200KB 上限的文件列表与非零退出码
 * [POS]: scripts 的构建质量门禁，被 prebuild 调用，替代旧 check-size 子包
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { SVG_SIZE_LIMIT_BYTES } from '../src/config/svg';

const LIBRARY_DIR = join(process.cwd(), 'static/library');

const kb = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;

async function* walkSvgs(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkSvgs(path);
    else if (entry.name.endsWith('.svg')) yield path;
  }
}

async function main() {
  const oversized: { path: string; size: number }[] = [];
  let total = 0;

  for await (const path of walkSvgs(LIBRARY_DIR)) {
    total++;
    const { size } = await stat(path);
    if (size > SVG_SIZE_LIMIT_BYTES) oversized.push({ path, size });
  }

  console.log(`🔎 已检查 ${total} 个 SVG，尺寸上限 ${kb(SVG_SIZE_LIMIT_BYTES)}`);

  if (oversized.length === 0) {
    console.log('✅ 所有文件均在限制内');
    return;
  }

  console.error(`❌ ${oversized.length} 个文件超限:`);
  for (const { path, size } of oversized) {
    console.error(`- 📄 ${path.replace(LIBRARY_DIR + '/', '')} — ${kb(size)}`);
  }
  process.exit(1);
}

main();
