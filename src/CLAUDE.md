# src/

> L2 | 父级: ../CLAUDE.md

成员清单
app.css: Tailwind 全局样式入口，定义基础滚动条、焦点态、动效降级与页面级视觉原语
app.d.ts: SvelteKit 全局类型声明入口，承载应用命名空间扩展
app.html: SvelteKit HTML 外壳，提供根挂载节点与全局 head 模板
components/: Svelte 视图组件层，封装导航、搜索、卡片、页脚、访问量展示与状态反馈
config/: 运行时静态配置层，保存分类、友情链接与 SVG 质量真相源
data/: 生成数据与版本记录层，暴露 SVG/分类索引、更新日志和 dev-only 发布草稿
docs/: Markdown 内容层，承载 about 等静态文档
routes/: SvelteKit 路由层，承载新版首页、兼容目录、API 与仅开发环境可用的投稿管理工具
server/: 服务端共享领域层，编译 static/library YAML 真相源并原子写入前端派生索引
ui/: 低层 UI primitive 层，封装 dialog、popover 与样式工厂
utils/: 通用浏览器工具层，封装剪贴板、SVG 读取、拼音匹配与样式辅助
index.test.ts: Vitest 冒烟测试入口，验证数据索引基本可用

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
