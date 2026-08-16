/**
 * [INPUT]: 依赖 SvelteKit LayoutServerLoad 的 url 上下文
 * [OUTPUT]: 对外提供布局级 pathname，供根布局做路由态判定
 * [POS]: routes 的根布局服务端加载器，是布局数据的唯一入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url: { pathname } }) => ({ pathname });
