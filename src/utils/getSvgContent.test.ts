/*
 * [INPUT]: 依赖 vitest 与浏览器 fetch mock
 * [OUTPUT]: 验证 getSvgContent 的成功缓存、HTTP 校验与失败驱逐语义
 * [POS]: utils 测试，保护复制/下载共享 SVG 读取边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSvgContent } from './getSvgContent';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getSvgContent', () => {
  it('reuses successful requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('<svg viewBox="0 0 1 1"/>'));
    vi.stubGlobal('fetch', fetchMock);

    await Promise.all([getSvgContent('/cache.svg'), getSvgContent('/cache.svg')]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects HTTP failures and allows retry', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('missing', { status: 404 }))
      .mockResolvedValueOnce(new Response('<svg viewBox="0 0 1 1"/>'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getSvgContent('/retry.svg')).rejects.toThrow('404');
    await expect(getSvgContent('/retry.svg')).resolves.toContain('<svg');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
