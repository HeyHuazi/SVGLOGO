/*
 * [INPUT]: 依赖 src/server/library-index 的内存生成结果与当前已提交索引文件
 * [OUTPUT]: 提供只读生成漂移门禁，不修改工作树即可验证派生数据一致性
 * [POS]: scripts 的 CI 证明入口，与 Admin/CLI 共享同一资产编译实现
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { readFile } from 'node:fs/promises';
import { buildLibraryIndex } from '../src/server/library-index';

async function main() {
  const build = await buildLibraryIndex();
  const [svgSource, categoriesSource] = await Promise.all([
    readFile(build.svgOutput, 'utf8'),
    readFile(build.categoriesOutput, 'utf8')
  ]);
  if (svgSource !== build.svgSource || categoriesSource !== build.categoriesSource) {
    throw new Error('生成数据已漂移，请运行 pnpm generate:svg 并提交结果');
  }
  console.log('✅ 生成数据与 YAML 真相源一致');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
