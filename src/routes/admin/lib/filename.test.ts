/*
 * [INPUT]: 依赖 vitest 与 admin/lib 共享文件名规则
 * [OUTPUT]: 验证 SVG 文件名建议、具体错误诊断与路径穿越防护
 * [POS]: routes/admin/lib 测试，保护浏览器预检与本地资产写入使用同一规则
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, expect, it } from 'vitest';
import { getSvgFilenameError, suggestSvgFilename, validateSvgFilename } from './filename';

describe('admin filename', () => {
  it('maps known brands and accepts safe names', () => {
    expect(suggestSvgFilename('特斯拉汽车')).toBe('Tesla.svg');
    expect(validateSvgFilename('Tesla.svg')).toBe('Tesla.svg');
  });

  it('returns actionable errors for unsafe names', () => {
    expect(getSvgFilenameError('Brand Logo.svg')).toBe('文件名只能包含中英文、数字、下划线、短横线和点');
    expect(getSvgFilenameError('../evil.svg')).toBe('文件名不能包含路径、斜杠或 ..');
    expect(getSvgFilenameError('logo.png')).toBe('文件名必须以 .svg 结尾');
    expect(getSvgFilenameError('品牌.svg')).toBeUndefined();
  });

  it.each(['../evil.svg', 'a/b.svg', 'a\\b.svg', '.svg', 'logo.png'])('rejects %s', (value) => {
    expect(() => validateSvgFilename(value)).toThrow();
  });
});
