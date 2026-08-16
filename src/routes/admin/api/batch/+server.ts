/*
 * [INPUT]: 依赖 SvelteKit RequestHandler、dev 环境保护与 admin/lib 本地 release 领域
 * [OUTPUT]: 对外提供 GET/PATCH/POST /admin/api/batch，读取、编辑、移出、清空并发布本地版本批次
 * [POS]: routes/admin/api 的批次 HTTP 适配器，只修改 release draft，不删除品牌资产，也不执行 Git、shell、构建或远程同步
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { assertAdminRequest } from '../../lib/guard';

export const GET: RequestHandler = async ({ request }) => {
  assertAdminRequest(request);
  const { readReleaseState } = await import('../../lib/release');
  return json(await readReleaseState());
};

export const PATCH: RequestHandler = async ({ request }) => {
  assertAdminRequest(request, true);
  try {
    const active = await request.json();
    const { updateReleaseDraft } = await import('../../lib/release');
    return json(await updateReleaseDraft(active));
  } catch (cause) {
    return json({ error: cause instanceof Error ? cause.message : '批次更新失败' }, { status: 400 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  assertAdminRequest(request, true);
  try {
    const payload = await request.json();
    const release = await import('../../lib/release');
    if (payload.action === 'publish') return json({ ok: true, state: await release.publishReleaseBatch() });
    if (payload.action === 'remove-item') return json({ ok: true, state: await release.removeReleaseDraftItem(payload.id) });
    if (payload.action === 'clear') return json({ ok: true, state: await release.clearReleaseDraft() });
    throw new Error('未知批次操作');
  } catch (cause) {
    return json({ ok: false, error: cause instanceof Error ? cause.message : '批次操作失败' }, { status: 400 });
  }
};
