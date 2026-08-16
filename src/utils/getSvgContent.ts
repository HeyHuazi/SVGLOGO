/*
 * [INPUT]: 依赖浏览器 fetch 读取站内 SVG 资源
 * [OUTPUT]: 对外提供 getSvgContent，同 URL 成功请求复用 Promise，失败请求自动驱逐以允许重试
 * [POS]: utils 的 SVG 文本读取边界，被复制与下载组件共享
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fetchCache = new Map<string, Promise<string>>();

export function getSvgContent(url: string | undefined): Promise<string> {
  if (!url) return Promise.reject(new Error('SVG URL 不能为空'));

  const cached = fetchCache.get(url);
  if (cached) return cached;

  const request = fetch(url)
    .then(async (response) => {
      if (!response.ok) throw new Error(`SVG 请求失败 (${response.status})`);
      const content = await response.text();
      if (!/<svg\b/i.test(content)) throw new Error('响应内容不是 SVG');
      return content;
    })
    .catch((error) => {
      fetchCache.delete(url);
      throw error;
    });

  fetchCache.set(url, request);
  return request;
}
