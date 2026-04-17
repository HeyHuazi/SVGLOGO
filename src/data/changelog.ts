export interface ChangelogEntry {
  date: string; // 日期：2025.10.28
  type: 'add' | 'fix' | 'announce' | 'remove'; // 类型
  description: string; // 描述文字
  contributor?: string; // 贡献者（可选）
}

// 更新日志数据
export const changelogData: ChangelogEntry[] = [
  {
    date: '2026.04.17',
    type: 'add',
    description: '更新西藏航空 Logo 并新增组合 Logo，新增国泰航空组合 Logo',
    contributor: '@李叫什么'
  },
  {
    date: '2026.04.11',
    type: 'add',
    description: '增加分类“消费品牌”并更新了几个LOGO',
    contributor: '@春和景明'
  },
  {
    date: '2026.04.08',
    type: 'announce',
    description: '网站设计大大大更新，去掉了烦人的广告',
  },
  {
    date: '2026.03.25',
    type: 'add',
    description: '终于抽空把去年8月份这位网页提交的 LOGO 更新了一波，现在表单中还有96个待处理，等我抽空继续更新',
    contributor: '@Jc1502'
  },
  {
    date: '2025.10.28',
    type: 'add',
    description: '更新了一大波航空公司的Logo',
    contributor: '@wxyzwwz'
  },
  {
    date: '2025.07.29',
    type: 'fix',
    description: '修复 中国石油大学 校徽错误',
    contributor: '@查思锐'
  },
  {
    date: '2025.07.26',
    type: 'add',
    description: '今天又库库更新了一大波AI产品的Logo'
  },
  {
    date: '2025.07.25',
    type: 'add',
    description: '卡奥斯COSMOPlat、京东科技、昱宁、花再、亚太财险和很多 AI工具 的图标',
    contributor: '@Minami @Alinyeee @小宁同学 @looooow'
  },
  {
    date: '2025.06.19',
    type: 'add',
    description: '增加 landing page'
  },
  {
    date: '2025.03.11',
    type: 'add',
    description: '蚂蚁集团全线产品图标、更新最新版支付宝图标',
    contributor: '@凯伦'
  },
  {
    date: '2025.03.11',
    type: 'remove',
    description: '洛阳银行经反馈已倒闭',
    contributor: '@沐樱WSakura'
  },
  {
    date: '2025.03.09',
    type: 'add',
    description: '150+ 银行logo、小鹅通',
    contributor: '@Rain'
  },
  {
    date: '2025.03.03',
    type: 'fix',
    description: '碧兒泉-->碧欧泉'
  },
  {
    date: '2025.02.20',
    type: 'add',
    description: '增加大量美妆品牌&黄金珠宝图标',
    contributor: '@小薛'
  },
  {
    date: '2025.02.10',
    type: 'add',
    description: '微信支付、企业微信、网易云、中国联通、中国移动、支付宝、花呗、华为、奈雪的茶、deepseek、凡科互动等',
    contributor: "@Ellie's Dad @加勒比海带 @字言anyi @增长超人官方 @嗯嗯 @不如喂猪 @·沉"
  },
  {
    date: '2025.02.10',
    type: 'fix',
    description: '小报童图标异常'
  },
  {
    date: '2024.11.22',
    type: 'add',
    description: '夸克网盘、word、ppt、outlook、excel、OneNote、MicrosoftTeams',
    contributor: '@angelussun @唐宁'
  },
  {
    date: '2024.11.22',
    type: 'fix',
    description: '清华大学校徽异常',
    contributor: '@下划线'
  },
  {
    date: '2024.10.15',
    type: 'add',
    description: '深物业集团、Motiff、Pixso、Boardmix、墨刀、新枝、阿里云盘、百度网盘、阿里云、小米等',
    contributor: '@不如喂猪 @锦杨科技'
  },
  {
    date: '2024.09.29',
    type: 'add',
    description: '安徽新华学院（花了我4毛钱在素材网站下的，呜呜呜）'
  },
  {
    date: '2024.09.19',
    type: 'add',
    description: '小红书横版、Canva可画',
    contributor: '@Enochayy'
  },
  {
    date: '2024.09.03',
    type: 'add',
    description: 'QingIcon、浪潮、五粮液、中国石化',
    contributor: '@Asorn'
  },
  {
    date: '2024.08.31',
    type: 'announce',
    description: '下载 SVG 功能恢复，增加链接（可跳转图标官网）'
  },
  {
    date: '2024.08.31',
    type: 'add',
    description: '北华大学、国家电网、腾讯、中国移动、中国人寿、光厂',
    contributor: '@Leo'
  },
  {
    date: '2024.08.27',
    type: 'announce',
    description: '下载 SVG 功能异常，暂时隐藏，可临时用在线复制 SVG'
  },
  {
    date: '2024.08.27',
    type: 'fix',
    description: 'LOGO 下载页显示变形'
  },
  {
    date: '2024.08.27',
    type: 'add',
    description: '字节跳动、TikTok、iconfont',
    contributor: '@Lainbo'
  },
  {
    date: '2024.08.26',
    type: 'add',
    description: '小牛翻译、彩云小译、火山引擎、优酷',
    contributor: '@Lainbo'
  },
  {
    date: '2024.08.22',
    type: 'add',
    description: '气象预警图标'
  },
  {
    date: '2024.08.21',
    type: 'add',
    description: '114 所大学校徽'
  },
  {
    date: '2024.08.18',
    type: 'announce',
    description: '测试版本上线'
  }
];

// 获取最近N条更新
export function getLatestChangelog(count: number = 5): ChangelogEntry[] {
  return changelogData.slice(0, count);
}
