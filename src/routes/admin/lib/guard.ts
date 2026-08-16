/*
 * [INPUT]: 依赖 SvelteKit dev 环境、请求 URL/headers 与本机管理 token
 * [OUTPUT]: 对外提供 assertAdminRequest，统一限制 dev、loopback Host、同源写请求和可选 token
 * [POS]: routes/admin/lib 的管理安全边界，被页面加载器和全部 admin API 复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

const loopbackHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

export function assertAdminRequest(request: Request, write = false) {
  if (!dev) throw error(404, 'Not found');
  const url = new URL(request.url);
  if (!loopbackHosts.has(url.hostname)) throw error(403, 'Admin only available from localhost');

  if (write) {
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) throw error(403, 'Cross-origin admin request rejected');
  }

  const expected = process.env.ADMIN_TOKEN;
  if (expected && request.headers.get('x-admin-token') !== expected) {
    throw error(401, 'Invalid admin token');
  }
}
