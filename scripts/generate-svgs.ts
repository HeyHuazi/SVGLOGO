/*
 * [INPUT]: 依赖 src/server/library-index 的共享资产索引编译能力
 * [OUTPUT]: 提供 pnpm generate:svg CLI，原子生成 src/data/svgs.ts 与 categories.ts
 * [POS]: scripts 的薄命令入口，与 Admin 和 CI 复用同一生成实现
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { writeLibraryIndex } from '../src/server/library-index';

writeLibraryIndex()
  .then(({ count }) => console.log(`✅ 已生成 ${count} 个图标`))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
