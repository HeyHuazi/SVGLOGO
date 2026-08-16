/**
 * [INPUT]: 依赖 vitest 与 src/data/svgs 生成数据
 * [OUTPUT]: 对外提供 SVG 数据索引的基础一致性测试
 * [POS]: 测试入口，验证生成数据仍满足页面消费的最低契约
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { describe, it, expect } from 'vitest';
import { svgs } from './data/svgs';

const categories = new Set(
  svgs.flatMap((svg) => (Array.isArray(svg.category) ? svg.category : [svg.category]))
);

describe('SVG data index', () => {
  it('contains generated logo entries', () => {
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('keeps the minimum page rendering contract', () => {
    for (const svg of svgs) {
      expect(svg.title).toBeTruthy();
      expect(svg.category).toBeTruthy();
      expect(svg.route).toBeTruthy();
      if (svg.url) expect(() => new URL(svg.url!)).not.toThrow();
    }
  });

  it('contains current Chinese category groups', () => {
    expect(categories.has('企业组织')).toBe(true);
    expect(categories.has('气象预警')).toBe(true);
    expect(categories.has('AI产品')).toBe(true);
  });
});
