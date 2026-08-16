/*
 * [INPUT]: 依赖 SvelteKit dev/localhost 保护与 admin/lib 本地品牌资产、分类、发布领域能力
 * [OUTPUT]: 对外提供 /admin 的 categories、完整 assets（含 Wordmark/主题资源）与 release 本地工作台数据
 * [POS]: routes/admin 的 dev-only 服务端入口，不读取远程投稿源或私有凭据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
  const { assertAdminRequest } = await import('./lib/guard');
  assertAdminRequest(request);

  const [{ getExistingAssets }, { adminCategories }, { readReleaseState }] = await Promise.all([
    import('./lib/library'),
    import('./lib/catalog'),
    import('./lib/release')
  ]);
  const [assets, release] = await Promise.all([getExistingAssets(), readReleaseState()]);
  return { categories: adminCategories, assets, release };
};
