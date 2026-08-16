/**
 * [INPUT]: 依赖 SvelteKit PageServerLoad 类型
 * [OUTPUT]: 对外提供首页 load 数据占位对象
 * [POS]: routes 的首页服务端入口，为未来服务端数据注入保留单一边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {};
};
