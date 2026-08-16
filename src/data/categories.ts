/**
 * [INPUT]: 依赖 src/server/library-index 与 src/config/categories 的分类统计
 * [OUTPUT]: 对外提供 CategoryEntry 类型与 categories 分类计数数组
 * [POS]: data 的生成分类索引，被布局、侧边栏与分类导航消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
// 自动生成，请勿手动编辑
// 由 src/server/library-index.ts 生成

export interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}

export const categories: CategoryEntry[] = [
  { name: "气象预警", slug: "气象预警", count: 218 },
  { name: "金融支付", slug: "金融支付", count: 161 },
  { name: "大学校徽", slug: "大学校徽", count: 120 },
  { name: "AI 产品", slug: "AI产品", count: 117 },
  { name: "企业组织", slug: "企业组织", count: 76 },
  { name: "航空公司", slug: "航空公司", count: 56 },
  { name: "工具产品", slug: "工具产品", count: 42 },
  { name: "美妆品牌", slug: "美妆品牌", count: 41 },
  { name: "社交媒体", slug: "社交媒体", count: 31 },
  { name: "黄金珠宝", slug: "黄金珠宝", count: 17 },
  { name: "汽车品牌", slug: "汽车品牌", count: 10 },
  { name: "消费品牌", slug: "消费品牌", count: 6 },
  { name: "其他", slug: "其他", count: 18 }
];
