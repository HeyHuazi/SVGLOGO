/*
 * [INPUT]: 无运行时依赖，集中描述 static/library 的分类目录、数据名、展示名与投稿关键词
 * [OUTPUT]: 对外提供 categoriesConfig、CategoryFolder/CategoryName 类型与分类查询/推断函数
 * [POS]: config 的分类真相源，被生成脚本、类型层、目录路由与本地 admin 共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export const categoriesConfig = [
  { folder: 'aigc', dataName: 'AI产品', displayName: 'AI 产品', keywords: ['ai', 'gpt', '智能', '大模型', '人工智能', 'claude', 'gemini'] },
  { folder: 'airline', dataName: '航空公司', displayName: '航空公司', keywords: ['航空', 'airline', '机场', 'flight'] },
  { folder: 'automotive', dataName: '汽车品牌', displayName: '汽车品牌', keywords: ['汽车', '车标', 'motor', 'auto', '新能源', 'tesla', '特斯拉', '比亚迪', '蔚来', '理想', '小鹏'] },
  { folder: 'company', dataName: '企业组织', displayName: '企业组织', keywords: ['集团', '公司', '有限', '股份', '科技', '保险', '证券'] },
  { folder: 'consumerBrands', dataName: '消费品牌', displayName: '消费品牌', keywords: ['食品', '饮料', '奶粉', '母婴', '家居', '家电'] },
  { folder: 'cosmetic', dataName: '美妆品牌', displayName: '美妆品牌', keywords: ['美妆', '护肤', '化妆品', '香水', 'cosmetic', 'beauty'] },
  { folder: 'goldJewelry', dataName: '黄金珠宝', displayName: '黄金珠宝', keywords: ['珠宝', '黄金', '钻石', '首饰', '金饰'] },
  { folder: 'other', dataName: '其他', displayName: '其他', keywords: [] },
  { folder: 'pay', dataName: '金融支付', displayName: '金融支付', keywords: ['支付', 'pay', '银行', 'bank', '信用卡'] },
  { folder: 'school', dataName: '大学校徽', displayName: '大学校徽', keywords: ['大学', '学院', '学校', 'university', '校徽'] },
  { folder: 'social', dataName: '社交媒体', displayName: '社交媒体', keywords: ['社交', '微博', '微信', '抖音', '快手', '小红书', 'bilibili', 'qq', 'twitter', 'github', 'instagram', 'facebook', 'youtube'] },
  { folder: 'tools', dataName: '工具产品', displayName: '工具产品', keywords: ['app', '工具', '软件', '浏览器', '编辑器', 'ide'] },
  { folder: 'weather', dataName: '气象预警', displayName: '气象预警', keywords: ['气象', '天气', 'weather', '预警'] }
] as const;

export type CategoryConfig = (typeof categoriesConfig)[number];
export type CategoryFolder = CategoryConfig['folder'];
export type CategoryName = CategoryConfig['dataName'];

export const getCategoryByFolder = (folder: string) =>
  categoriesConfig.find((category) => category.folder === folder);

export const getCategoryByDataName = (dataName: string) =>
  categoriesConfig.find((category) => category.dataName === dataName);

export const isCategoryFolder = (folder: string): folder is CategoryFolder =>
  getCategoryByFolder(folder) !== undefined;

export function inferCategory(title: string): CategoryFolder {
  const normalized = title.toLowerCase();
  return (
    categoriesConfig.find((category) =>
      category.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
    )?.folder ?? 'company'
  );
}
