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

### 🚀 快速流程（推荐）

#### 1) 放置 SVG 文件

将 `.svg` 文件放到对应分类文件夹：

```bash
static/library/
  ├── aigc/          # AI产品
  ├── airline/       # 航空公司
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
| `pnpm dev` | 启动开发服务器 | 自动生成 svgs.ts |
| `pnpm build` | 构建生产版本 | 自动扫描+生成 |

---

### 💡 文件组织规则

**分类体系（12 个分类）：**

| 分类名称 | 文件夹 | 说明 |
|---------|-------|------|
| AI产品 | aigc/ | AI 相关产品和服务 |
| 航空公司 | airline/ | 航空公司 Logo |
| **汽车品牌** | **automotive/** | **汽车品牌 Logo** |
| 企业组织 | company/ | 企业和组织 |
| 美妆品牌 | cosmetic/ | 化妆品品牌 |
| 黄金珠宝 | goldJewelry/ | 黄金珠宝品牌 |
| 其他 | other/ | 其他类别 |
| 金融支付 | pay/ | 银行、支付工具 |
| 大学校徽 | school/ | 大学校徽 |
| 社交媒体 | social/ | 社交媒体平台 |
| 工具产品 | tools/ | 工具和产品 |
| 气象预警 | weather/ | 气象预警图标 |

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
