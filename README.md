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

SVGLOGO 面向中文用户收录常用品牌与组织标识，支持关键词与拼音搜索、分类浏览、SVG/PNG 复制和下载。项目同时提供仅开发环境可用的本地资产工作台，将多文件 SVG 草稿原子写入资产库并维护发布批次。

## 功能特点

- 关键词、拼音搜索与分类筛选
- 浅色 / 深色版本与 Wordmark 支持
- 一键复制或下载 SVG / PNG
- 首屏优先加载与渐进式无限滚动
- 多文件 SVG 草稿、原子批量入库和可恢复发布批次
- Cloudflare Pages 部署

## 技术栈

SvelteKit 2 + Svelte 4 + TypeScript + Tailwind CSS + Vitest + YAML + Cloudflare adapter。

---

## 本地开发

### 环境要求

- Node.js 20+
- pnpm 10

```bash
pnpm install
pnpm dev
```

默认访问：<http://localhost:5173>

开发环境中的资产管理后台：<http://localhost:5173/admin>

后台直接维护当前 Git 工作区，不需要远程投稿服务或额外私有凭据。

构建与 Cloudflare 本地预览：

```bash
pnpm build
pnpm preview:cloudflare
```

---

## 资产流水线

### 单一真相源

```text
static/library/{category}/*.svg
static/library/{category}/_meta.yaml
```

SVG 文件与分类 YAML 是资产事实；以下文件是可再生派生物，不应手动编辑：

```text
src/data/svgs.ts
src/data/categories.ts
```

数据流如下：

```text
/admin 或维护工具
        ↓
SVG + _meta.yaml
        ↓
src/server/library-index.ts
        ↓
src/data/svgs.ts + src/data/categories.ts
        ↓
前台渲染
```

### 日常新增或更新 Logo

日常维护统一使用 `/admin`：

1. 将一个或多个 SVG 拖入后台草稿区。
2. 确认每项标题、文件名、分类、官网、贡献者和新增/更新类型。
3. 后台先对整批草稿执行文件名、冲突、URL 和 SVG 安全校验。
4. 全批通过后，在同一事务中写入 SVG、YAML、发布草稿，并只生成一次前端索引。
5. 任一步失败，整批资产、元数据、草稿和生成索引都会恢复。

后台只在 SvelteKit `dev` 模式和 localhost 开放；生产环境不能调用本地写入能力。

### Wordmark、dark/light 与批量迁移

当前后台日常上传处理单个主 Logo。Wordmark、dark/light 双版本及大批量目录迁移仍通过 YAML 资产模型维护：

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

完成维护后运行：

```bash
pnpm generate:svg
```

### 维护与灾难恢复

`check:library` 只读检查磁盘 SVG 与 YAML 是否一致：

```bash
pnpm check:library
```

如果批量复制或历史迁移产生了未登记 SVG，可在人工确认后显式修复：

```bash
pnpm repair:library-meta
```

修复器会根据文件名和 `scripts/title-mappings.json` 补充条目，并可能生成 `url: TODO`。它不是日常入库入口；运行后必须人工检查 YAML，再执行 `pnpm generate:svg`。

---

## 常用命令

| 命令 | 职责 |
|---|---|
| `pnpm dev` | 启动开发环境；启动前生成前端资产索引 |
| `pnpm generate:svg` | 将 SVG/YAML 真相源原子编译为前端 TypeScript 索引 |
| `pnpm check:library` | 只读检查 SVG 文件与 YAML 元数据一致性 |
| `pnpm repair:library-meta` | 批量迁移或异常恢复时显式补录 YAML |
| `pnpm check:generated` | 只读验证前端索引没有生成漂移 |
| `pnpm check:size` | 检查 SVG 是否超过 200KB |
| `pnpm prebuild` | 组合所有资产只读门禁 |
| `pnpm check` | 执行 Svelte/TypeScript 检查 |
| `pnpm test` | 运行 Vitest 测试 |
| `pnpm build` | 通过资产门禁后构建 Cloudflare 版本 |

`prebuild` 和 CI 不会修复或重写资产，只负责证明仓库当前状态可发布。

---

## 项目结构

```text
.github/workflows/quality.yml  # 类型、测试、资产、漂移、尺寸与构建门禁
scripts/
  generate-svgs.ts            # 共享编译器的 CLI 入口
  check-generated.ts          # 只读生成漂移门禁
  scan-svgs.ts                # 资产一致性检查与显式恢复
  check-size.ts               # SVG 尺寸门禁
  migrate-svgs.ts             # 历史资产迁移工具
  title-mappings.json         # 文件名到品牌标题的维护映射
src/
  components/                 # 搜索、卡片、导航与下载视图组件
  config/                     # 分类、友情链接与 SVG 质量真相源
  data/                       # 自动生成索引、更新日志与发布草稿
  routes/                     # 首页、兼容目录、API 与 dev-only Admin
  server/library-index.ts     # Admin、CLI、CI 共享的资产索引编译器
  types/                      # SVG 与分类领域类型
  ui/                         # 底层 UI primitives
  utils/                      # 浏览器与 SVG 工具
static/library/               # SVG 与分类 YAML 资产真相源
```

---

## 质量门禁

提交前至少运行：

```bash
pnpm check
pnpm test
pnpm prebuild
pnpm onlybuild
```

GitHub Actions 还会执行最终 `git diff --exit-code`，确保验证过程没有产生未提交文件。

---

## 部署

项目使用 `@sveltejs/adapter-cloudflare` 构建 Cloudflare Pages 版本。

环境变量参考 [`.env.example`](./.env.example)，当前仅包含可选的站点统计配置。

---

## 贡献说明

欢迎提交 Logo、Issue、代码或文档改进。

选择合适的贡献路径：

- **普通 Logo 投稿：** 使用 [Logo 投稿 Issue 模板](./.github/ISSUE_TEMPLATE/logo-submission.md)，附加 SVG 或官方资源地址。
- **熟悉仓库结构的贡献者：** 直接提交 Pull Request，并同步 SVG 与分类 `_meta.yaml`。
- **维护者本地处理：** 使用 dev-only `/admin` 多文件工作台完成校验、原子入库与发布批次维护。

提交前检查：

- 你拥有该 Logo 的使用权限，或其许可允许收录与展示。
- 文件名、分类、标题与官网准确。
- SVG 可以正常渲染且不包含脚本、事件处理器或外部资源。
- 日常资产维护优先使用 `/admin`；旁路修改必须同步 YAML。
- 已运行 `pnpm check`、`pnpm test` 和 `pnpm prebuild`。

开发流程：Fork → 创建分支 → 修改并验证 → 推送 → Pull Request。

---

## 版权声明

项目展示的矢量图形主要来源于网络公开信息整理，仅供学习与参考。商标及图形版权归原权利方所有；使用者应自行确认授权范围并承担相应责任。

## 致谢

- [svgl](https://github.com/pheralb/svgl)
- [中国大学矢量校徽合集](https://www.figma.com/community/file/916515339708288305)
- [预警信号 ICON](https://www.figma.com/community/file/1133299341246601360)
- 所有素材贡献者与社区协作者

## License

[MIT](./LICENSE)

项目版本历史以 [src/data/changelog.json](./src/data/changelog.json) 为结构化真相源。
