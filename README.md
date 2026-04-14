<div align="center">
  <a href="https://svglogo.top/" target="_blank" rel="noopener noreferrer">
    <img src="static/images/banner.png" alt="SVGLOGO Banner" />
  </a>

  <h1>SVGLOGO</h1>
  <p>专注收录国内矢量 Logo 的开源站点 <span style="margin-left: 10px; padding: 2px 8px; background-color: #e1f5fe; border-radius: 12px; font-size: 12px; color: #0277bd;">v4.2.1</span></p>

  <p>
    <a href="https://svglogo.top/" target="_blank" rel="noopener noreferrer">在线访问</a>
    <span> · </span>
    <a href="https://tally.so/r/3qOv78" target="_blank" rel="noopener noreferrer">提交图标</a>
    <span> · </span>
    <a href="https://huazi.space/" target="_blank" rel="noopener noreferrer">作者主页</a>
    <span> · </span>
    <a href="https://afdian.com/a/heyhuazi" target="_blank" rel="noopener noreferrer">赞助支持</a>
  </p>
</div>

---

## 项目简介

SVGLOGO 是一个面向中文用户的矢量标志素材站，聚焦国内常用品牌与组织标识，支持在线浏览、检索、复制与下载（SVG/PNG）。

你可以在这里找到例如：
- 国内社媒与互联网产品 Logo
- 大学校徽与校园标识
- 气象预警图标
- 设计/开发常用工具 Logo

> 持续更新中，欢迎提交你希望补充的 Logo。

---

## 功能特点

- 🔍 关键词搜索与分类筛选
- 🌓 浅色 / 深色版本支持
- 📋 一键复制 SVG / PNG 到剪贴板
- ⬇️ 下载 SVG / PNG（含多版本打包）
- 🧩 支持 Wordmark（字标）展示与下载
- 📊 自动获取 Git 提交信息
- 🚀 支持 Vercel 和 Cloudflare 部署
- ✨ 精心打磨的界面交互细节
  - 🎯 分类滑动指示器动画
  - ♾️ 无限滚动自动加载
  - 🎨 动态主题色与焦点环
  - 🎮 Konami 代码彩蛋（↑↑↓↓←→←→BA）
  - 🖱️ 双击卡片查看品牌创立年份

---

## 技术栈

- [SvelteKit](https://kit.svelte.dev/) - 全栈框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [mdsvex](https://mdsvex.com/) - Markdown in Svelte
- [Shiki](https://github.com/shikijs/shiki) - 语法高亮
- [bits-ui](https://www.bits-ui.com) - 无头 UI 组件
- [svelte-sonner](https://github.com/wobsoriano/svelte-sonner) - Toast 通知
- [JSZip](https://stuk.github.io/jszip/) - ZIP 文件处理
- [downloadjs](https://www.npmjs.com/package/downloadjs) - 文件下载
- [Vitest](https://vitest.dev/) - 单元测试
- [lucide-svelte](https://lucide.dev/) - 图标库
- [clsx](https://github.com/lukeed/clsx) - 类名工具
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Tailwind 类名合并
- [mode-watcher](https://github.com/huntabyte/mode-watcher) - 暗色模式监听

---

## 本地开发

### 1) 环境要求

- Node.js 18+
- pnpm（推荐）

### 2) 安装依赖

```bash
pnpm install
```

### 3) 启动开发环境

```bash
pnpm dev
```

默认访问：<http://localhost:5173>

### 4) 构建与预览

```bash
pnpm onlybuild
pnpm preview
```

### 5) 获取 Git 提交信息

```bash
pnpm get:git-info
```

此脚本会自动获取最新的 Git 提交时间并写入配置文件，用于显示项目最后更新时间。

---

## 项目结构（核心）

```text
src/
  components/        # UI 组件（搜索、卡片、下载、复制等）
  config/            # 配置文件（git-info.json 等）
  data/              # Logo 数据源（自动生成）
  routes/            # 路由页面（首页、explore、api...）
  types/             # TS 类型定义
  lib/               # 工具函数和共享逻辑
static/
  library/           # SVG 资源文件（按分类组织）
  images/            # 图片资源
scripts/
  scan-svgs.ts       # 扫描新增 SVG
  generate-svgs.ts   # 生成数据文件
  get-git-info.ts    # 获取 Git 提交信息
  migrate-svgs.ts    # 迁移脚本
  title-mappings.json # 文件名映射表
```

---

## 如何新增一个 Logo

### 🚀 快速流程（推荐）

#### 1) 放置 SVG 文件

将 `.svg` 文件放到对应分类文件夹：

```bash
static/library/
  ├── aigc/          # AI产品
  ├── airline/       # 航空公司
  ├── automotive/    # 汽车品牌
  ├── company/       # 企业组织
  ├── cosmetic/      # 美妆品牌
  ├── goldJewelry/   # 黄金珠宝
  ├── other/         # 其他
  ├── pay/           # 金融支付
  ├── school/        # 大学校徽
  ├── social/        # 社交媒体
  ├── tools/         # 工具产品
  └── weather/       # 气象预警
```

**命名约定：**
- 主 Logo：`brand.svg`（如 `xiaomi.svg`）
- Wordmark：`brand_wordmark.svg`（如 `xiaomi_wordmark.svg`）

#### 2) 运行扫描命令

```bash
pnpm scan:svg
```

脚本会自动：
- ✅ 扫描新增的 SVG 文件
- ✅ 智能提取标题（基于文件名或映射表）
- ✅ 自动识别 wordmark（后缀 `_wordmark.svg`）
- ✅ 更新 `_meta.yaml` 文件

**输出示例：**
```bash
🔍 扫描目录: static/library/
━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 company/
  ✅ 新增: 1 个文件
     → new-brand.svg
  📝 已更新: _meta.yaml

━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 统计:
  新增: 1 个
  缺失: 0 个

⚠️  提示: 请检查 _meta.yaml 并补充必要信息（如 URL）
```

#### 3) 补充必要信息（可选）

编辑对应的 `_meta.yaml` 文件，补充 URL 等信息：

```yaml
# static/library/company/_meta.yaml
items:
  # ... 其他条目 ...
  - title: 新品牌
    file: new-brand.svg
    url: https://example.com/  # ← 修正 URL（原为 TODO）
```

#### 4) 启动开发服务器

```bash
pnpm dev
```

脚本会自动生成 `src/data/svgs.ts`，你的新 Logo 已添加成功！

---

### 📝 YAML 元数据格式

每个分类文件夹下都有 `_meta.yaml` 文件，格式如下：

#### 简单格式（只有必需字段）

```yaml
items:
  - title: 小米
    file: xiaomi.svg
    url: https://www.mi.com/
```

#### 包含 Wordmark

```yaml
items:
  - title: 字节跳动
    file: bytedance.svg
    wordmark: bytedance_wordmark.svg
    url: https://www.bytedance.com/
```

#### 暗色/亮色双版本

```yaml
items:
  - title: 某品牌
    file: 
      dark: brand_dark.svg
      light: brand_light.svg
    wordmark:
      dark: brand_wordmark_dark.svg
      light: brand_wordmark_light.svg
    url: https://example.com/
```

**字段说明：**

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `title` | ✅ | string | 显示名称 |
| `file` | ✅ | string \| object | SVG 文件路径（相对路径） |
| `url` | ✅ | string | 官网 URL（新条目自动填充 `"TODO"`） |
| `wordmark` | ❌ | string \| object | Wordmark 文件路径 |

**注意：** 
- 分类由文件夹名自动决定（不需要在 YAML 中指定）
- 一个图标只属于一个分类

---

### 🛠️ 常用命令

| 命令 | 用途 | 何时使用 |
|------|------|----------|
| `pnpm scan:svg` | 扫描新增 SVG，更新 YAML | 添加新文件后 |
| `pnpm generate:svg` | 生成 svgs.ts | 自动执行（无需手动运行） |
| `pnpm get:git-info` | 获取 Git 提交信息 | 构建时自动执行 |
| `pnpm dev` | 启动开发服务器 | 自动生成 svgs.ts |
| `pnpm build` | 构建生产版本 | 自动扫描+生成 |
| `pnpm check` | 类型检查 | 开发时检查 |
| `pnpm test` | 运行测试 | 确保代码质量 |

---

### 💡 文件组织规则

**分类体系（12 个分类）：**

| 分类名称 | 文件夹 | 数量 | 说明 |
|---------|-------|------|------|
| AI产品 | aigc/ | 114 | AI 相关产品和服务 |
| 航空公司 | airline/ | 56 | 航空公司 Logo |
| 汽车品牌 | automotive/ | 7 | 汽车品牌 Logo |
| 企业组织 | company/ | 73 | 企业和组织 |
| 消费品牌 | consumerBrands/ | 3 | 消费品牌 |
| 美妆品牌 | cosmetic/ | 41 | 化妆品品牌 |
| 黄金珠宝 | goldJewelry/ | 17 | 黄金珠宝品牌 |
| 其他 | other/ | 18 | 其他类别 |
| 金融支付 | pay/ | 161 | 银行、支付工具 |
| 大学校徽 | school/ | 120 | 大学校徽 |
| 社交媒体 | social/ | 31 | 社交媒体平台 |
| 工具产品 | tools/ | 41 | 工具和产品 |
| 气象预警 | weather/ | 218 | 气象预警图标 |

**规则：**
- 按主要业务领域放文件夹
- 文件夹名决定分类名（自动映射）
- 不支持多分类（一个图标只属于一个分类）

---

### 📂 文件结构

```
SVGLOGO/
├── scripts/
│   ├── scan-svgs.ts          # 扫描新增 SVG，更新 _meta.yaml
│   ├── generate-svgs.ts      # 读取 YAML，生成 svgs.ts
│   ├── migrate-svgs.ts       # 迁移脚本（仅首次使用）
│   ├── get-git-info.ts       # 获取 Git 提交信息
│   └── title-mappings.json   # 文件名 → 中文标题映射表
│
├── static/library/
│   ├── aigc/
│   │   ├── _meta.yaml        # AI产品元数据
│   │   ├── ChatGPT.svg
│   │   └── Claude.svg
│   ├── company/
│   │   ├── _meta.yaml        # 企业组织元数据
│   │   ├── xiaomi.svg
│   │   └── bytedance.svg
│   └── ... (其他分类)
│
└── src/data/
    └── svgs.ts               # 自动生成，请勿手动编辑
```

---

### 🔧 高级功能

#### 自定义标题映射

如果文件名无法自动识别为正确的中文名称，可以编辑 `scripts/title-mappings.json`：

```json
{
  "xiaomi": "小米",
  "bytedance": "字节跳动",
  "newbrand": "新品牌"
}
```

#### 批量添加

```bash
# 一次性添加多个文件
cp ~/Downloads/*.svg static/library/company/

# 运行一次扫描
pnpm scan:svg
```

---

### ❌ 旧流程（已废弃）

<details>
<summary>点击查看旧的手动编辑 svgs.ts 流程</summary>

**不再推荐**：手动编辑 `src/data/svgs.ts`

旧示例：
```ts
{
  title: '示例',
  category: '社交媒体',
  route: '/library/example.svg',
  url: 'https://example.com'
}
```

现在请使用上述自动化流程。
</details>

---

## 部署

### Vercel 部署

项目已配置 Vercel 部署，支持自动部署。

**配置文件：** `vercel.json`

**特性：**
- 静态资源缓存优化
- SVG 文件正确 Content-Type
- 自动重定向规则

### Cloudflare 部署

项目也支持 Cloudflare Workers/Pages 部署。

**依赖：** `@sveltejs/adapter-cloudflare`

**配置：** `.wrangler/` 目录

---

## 环境变量（可选）

如果需要本地调试 API 统计/限流相关能力，可配置 `.env`：

```bash
# API 限流
SVGL_API_REQUESTS=1
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""

# 统计分析
PUBLIC_51LA_ID=""

# 其他配置
PUBLIC_SITE_URL="https://svglogo.top"
```

---

## 贡献说明

欢迎通过以下方式参与：

1. 提交 Logo 或修正素材信息
2. 提交 Issue 反馈体验问题
3. 提交 PR 优化功能或文档

### 提交前检查清单

- [ ] 你拥有该 Logo 的使用权限，或其许可允许收录与展示
- [ ] 文件命名、分类、链接信息准确
- [ ] SVG 资源可正常渲染
- [ ] 已运行 `pnpm scan:svg` 更新元数据
- [ ] 已测试本地开发环境正常运行

### 开发流程

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

## 版权声明

本项目所展示矢量图形主要来源于网络公开信息整理，仅供学习与参考。相关商标及图形版权归原权利方所有。

请勿在未经授权的情况下将素材用于商业用途；使用者应自行确认授权范围并承担相应法律责任。

---

## 致谢

- 开源项目 [svgl](https://github.com/pheralb/svgl)（本项目的重要灵感来源）
- [中国大学矢量校徽合集](https://www.figma.com/community/file/916515339708288305)
- [预警信号 ICON](https://www.figma.com/community/file/1133299341246601360)
- 感谢社区朋友们对部署、设计和内容整理的帮助

---

## License

[MIT](./LICENSE)

---

## 更新日志

### v4.2.1 (2026-04-15)

- ✨ 界面交互细节优化（Phase 1-5，共 17 项）
  - 动态 `theme-color` meta 标签随深色模式切换
  - 焦点环颜色统一为品牌绿色（#06B30C）
  - `prefers-reduced-motion` 无障碍支持
  - 卡片悬停缩放与浮起动效
  - 主题切换按钮旋转动画
  - 分类侧边栏滑动高亮指示器
  - 加载更多按钮 loading 状态
  - 分类计数切换动画
  - 回到顶部浮动按钮
  - 分类切换自动平滑滚动
  - 无限滚动自动加载（IntersectionObserver）
  - Logo 卡片内阴影边缘
  - 嵌套圆角一致性
  - 卡片标题 tooltip
  - 搜索框随机占位符示例
  - Hero 区域绿色选中样式
- 🎮 新增彩蛋功能
  - Konami 代码彩蛋（↑↑↓↓←→←→BA）
  - 404 页面可拖拽 SVG 插画
  - 双击 Logo 卡片显示品牌创立年份
- 🐛 修复侧边栏分类指示器与按钮的对齐问题
- 📊 总计收录 **900** 个矢量图标

### v4.2.0 (2026-04-08)
- ✨ 新增 Git 提交信息自动获取功能
- 🚀 支持 Cloudflare 部署
- 📊 更新技术栈依赖
- 📝 完善文档和贡献指南
- 🔧 优化构建流程