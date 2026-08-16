/*
 * [INPUT]: 依赖 src/config/svg 的共享尺寸与大小限制，以及原始 SVG 字符串
 * [OUTPUT]: 对外提供 validateAndNormalizeSvg，剥离合法 DOCTYPE，重写根 SVG 尺寸并拒绝危险内容
 * [POS]: routes/admin/lib 的 SVG 入库门禁，被 library 事务服务唯一调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { SVG_SIZE_LIMIT_BYTES, SVG_TARGET_HEIGHT } from '@/config/svg';

const forbiddenPatterns = [
  /<!ENTITY\b/i,
  /<script\b/i,
  /<foreignObject\b/i,
  /\son[a-z]+\s*=/i,
  /javascript\s*:/i,
  /@import\s+/i,
  /<(?:image|use)\b[^>]*(?:href|xlink:href)\s*=\s*["']https?:/i,
  /<style\b[^>]*>[\s\S]*url\(\s*["']?https?:/i
];

// 拦截含内部子集的 DOCTYPE（XXE 温床），纯 PUBLIC 引用在下方自动剥离
const doctypeInternalSubset = /<!DOCTYPE\b[^>]*\[/i;

function stripDoctype(svg: string) {
  return svg.replace(/<!DOCTYPE\b[^>]*>/i, '').trim();
}

function rootTag(svg: string) {
  const match = /<svg\b[^>]*>/i.exec(svg);
  if (!match) throw new Error('附件不是有效 SVG');
  return match[0];
}

function parseDimensions(tag: string) {
  const viewBox = tag.match(/\bviewBox=["']([^"']+)["']/i)?.[1];
  if (viewBox) {
    const values = viewBox.trim().split(/[\s,]+/).map(Number);
    if (values.length === 4 && values.every(Number.isFinite) && values[2] > 0 && values[3] > 0) {
      return { width: values[2], height: values[3] };
    }
    throw new Error('SVG viewBox 无效');
  }

  const width = Number.parseFloat(tag.match(/\bwidth=["']([\d.]+)/i)?.[1] ?? '');
  const height = Number.parseFloat(tag.match(/\bheight=["']([\d.]+)/i)?.[1] ?? '');
  if (width > 0 && height > 0) return { width, height };
  throw new Error('SVG 根节点缺少有效 viewBox 或宽高');
}

export function validateAndNormalizeSvg(content: string, targetHeight = SVG_TARGET_HEIGHT): string {
  const svg = content.trim();
  if (Buffer.byteLength(svg, 'utf8') > SVG_SIZE_LIMIT_BYTES) throw new Error('SVG 文件超过 200KB');
  if (doctypeInternalSubset.test(svg)) throw new Error('SVG 包含不允许的 DOCTYPE 内部子集');
  if (forbiddenPatterns.some((pattern) => pattern.test(svg))) throw new Error('SVG 包含不允许的外部或可执行内容');

  const cleaned = stripDoctype(svg);
  const originalTag = rootTag(cleaned);
  const { width, height } = parseDimensions(originalTag);
  const normalizedWidth = Number((targetHeight * (width / height)).toFixed(2));
  const normalizedTag = originalTag
    .replace(/\swidth=["'][^"']*["']/i, '')
    .replace(/\sheight=["'][^"']*["']/i, '')
    .replace(/>$/, ` width="${normalizedWidth}" height="${targetHeight}">`);

  return cleaned.replace(originalTag, normalizedTag);
}
