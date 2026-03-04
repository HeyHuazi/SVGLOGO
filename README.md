<div align="center">
  <a href="https://svglogo.top/" target="_blank" rel="noopener noreferrer">
    <img src="static/images/banner.png" alt="SVGLOGO Banner" />
  </a>

  <h1>SVGLOGO</h1>
  <p>专注收录国内矢量 Logo 的开源站点</p>

  <p>
    <a href="https://svglogo.top/" target="_blank" rel="noopener noreferrer">在线访问</a>
    <span> · </span>
    <a href="https://tally.so/r/3qOv78" target="_blank" rel="noopener noreferrer">提交图标</a>
    <span> · </span>
    <a href="https://huazi.space/" target="_blank" rel="noopener noreferrer">作者主页</a>
  </p>
</div>

---

## 项目简介

SVGLOGO 是一个面向中文用户的矢量 Logo 素材站，聚焦国内常用品牌与组织标识，支持在线浏览、检索、复制与下载（SVG/PNG）。

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
- 📝 博客内容页（设计与资源相关）

---

## 技术栈

- [SvelteKit](https://kit.svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [mdsvex](https://mdsvex.com/)
- [Shiki](https://github.com/shikijs/shiki)
- [bits-ui](https://www.bits-ui.com)
- [svelte-sonner](https://github.com/wobsoriano/svelte-sonner)
- [JSZip](https://stuk.github.io/jszip/)
- [downloadjs](https://www.npmjs.com/package/downloadjs)
- [Vitest](https://vitest.dev/)

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

---

## 项目结构（核心）

```text
src/
  components/        # UI 组件（搜索、卡片、下载、复制等）
  data/              # Logo 数据源
  routes/            # 路由页面（首页、explore、blog、api...）
  types/             # TS 类型定义
static/
  library/           # SVG 资源文件
```

---

## 如何新增一个 Logo

### 1) 放置 SVG 文件

将 `.svg` 文件放到：

- `static/library/`

### 2) 更新数据源

在 `src/data/svgs.ts` 中新增条目（示例）：

#### 仅单个 Logo

```ts
{
  title: '示例',
  category: '社交媒体',
  route: '/library/example.svg',
  url: 'https://example.com'
}
```

#### Logo + Wordmark

```ts
{
  title: '示例',
  category: '工具产品',
  route: '/library/example.svg',
  wordmark: '/library/example_wordmark.svg',
  url: 'https://example.com'
}
```

#### 含浅色/深色版本

```ts
{
  title: '示例',
  category: ['工具产品', '设计资源'],
  route: {
    light: '/library/example_light.svg',
    dark: '/library/example_dark.svg'
  },
  wordmark: {
    light: '/library/example_wordmark_light.svg',
    dark: '/library/example_wordmark_dark.svg'
  },
  url: 'https://example.com'
}
```

> 分类类型可参考 `src/types/categories.ts`。

---

## 环境变量（可选）

如果需要本地调试 API 统计/限流相关能力，可配置 `.env`：

```bash
SVGL_API_REQUESTS=1
UPSTASH_REDIS_URL=""
UPSTASH_REDIS_TOKEN=""
```

并可根据需要配置：

```bash
PUBLIC_51LA_ID=""
```

---

## 贡献说明

欢迎通过以下方式参与：

1. 提交 Logo 或修正素材信息
2. 提交 Issue 反馈体验问题
3. 提交 PR 优化功能或文档

提交前请确保：

- 你拥有该 Logo 的使用权限，或其许可允许收录与展示
- 文件命名、分类、链接信息准确
- SVG 资源可正常渲染

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
