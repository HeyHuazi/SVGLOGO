/**
 * [INPUT]: 无运行时依赖，纯常量配置
 * [OUTPUT]: 对外提供 Sponsor 类型、sponsors 列表与 SPONSOR_PLAN 赞助方案配置
 * [POS]: config 层的赞助真相源，被 sponsorSection 组件消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface Sponsor {
  /** 品牌展示名称 */
  name: string;
  /** 官网外链 */
  url: string;
  /** 一句话描述 */
  description: string;
  /** 内联 SVG path（d），用于品牌标 */
  logoPath: string;
  /** 品牌主色（十六进制），用于图标填充 */
  color: string;
}

/**
 * 真实赞助商列表。当前为空，首页赞助区域全部渲染虚线占位卡；
 * 新增赞助商后按序补充，首页卡片自动从占位切换为品牌实线卡。
 */
export const sponsors: Sponsor[] = [];

/** 赞助方案（占位卡弹窗展示） */
export const SPONSOR_PLAN = {
  /** 展示价格文案 */
  price: '¥299/月',
  /** 权益列表 */
  perks: ['品牌 Logo 与名称展示在首页', '官网外链直达', '一句话品牌描述'],
  /** 赞助跳转链接（爱发电下单页） */
  donateUrl:
    'https://ifdian.net/order/create?plan_id=62583fee998f11f18b6a5254001e7c00&product_type=0&remark=&affiliate_code=&fr=afcom'
} as const;
