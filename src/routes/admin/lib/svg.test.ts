/*
 * [INPUT]: 依赖 vitest 与 admin/lib SVG 入库门禁
 * [OUTPUT]: 验证合法 SVG 尺寸规范化与危险内容拒绝
 * [POS]: routes/admin/lib 测试，保护公开投稿的 SVG 安全边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, expect, it } from 'vitest';
import { validateAndNormalizeSvg } from './svg';

describe('admin SVG validation', () => {
  it('normalizes a valid SVG', () => {
    const result = validateAndNormalizeSvg('<svg viewBox="0 0 100 50"><path d="M0 0"/></svg>');
    expect(result).toContain('width="92"');
    expect(result).toContain('height="46"');
  });

  it('preserves child dimensions while normalizing the root', () => {
    const result = validateAndNormalizeSvg(
      '<svg width="100" height="50"><rect width="80" height="40"/></svg>'
    );
    expect(result).toContain('<svg width="92" height="46">');
    expect(result).toContain('<rect width="80" height="40"/>');
  });

  it.each([
    '<svg viewBox="0 0 1 1"><script>alert(1)</script></svg>',
    '<svg viewBox="0 0 1 1" onload="alert(1)"></svg>',
    '<svg viewBox="0 0 1 1"><foreignObject/></svg>',
    '<svg viewBox="0 0 1 1"><image href="https://example.com/a.png"/></svg>',
    '<!DOCTYPE svg [<!ENTITY xxe "evil">]><svg viewBox="0 0 1 1"><text>&xxe;</text></svg>',
    '<svg viewBox="0 0 1 1"><text>&#60;<!ENTITY&#62;</text></svg>'
  ])('rejects unsafe SVG', (value) => {
    expect(() => validateAndNormalizeSvg(value)).toThrow();
  });

  it('strips a pure PUBLIC DOCTYPE and passes', () => {
    const input = `<?xml version="1.0"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg viewBox="0 0 100 50"><path d="M0 0"/></svg>`;
    const result = validateAndNormalizeSvg(input);
    expect(result).not.toContain('<!DOCTYPE');
    expect(result).toContain('width="92"');
  });
});
