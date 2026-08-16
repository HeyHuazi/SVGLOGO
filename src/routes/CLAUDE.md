# routes/

> L2 | 父级: ../CLAUDE.md

成员清单
+layout.server.ts: SvelteKit 根布局服务端加载器，提供布局级 pathname
+layout.svelte: Svelte 根布局组件，装配全局样式、主题、目录页临时侧栏、页面过渡与 Toaster
+page.server.ts: SvelteKit 首页服务端加载器，保留首页数据入口
+page.svelte: Svelte 新版首页组件，基于 svgsData 与 categories 实现搜索、分类、排序、渐进加载与广告混排
+error.svelte: Svelte 错误页组件，承接 SvelteKit 异常渲染
about/: 关于页路由，渲染项目说明文档
admin/: dev-only 本地 SVG 资产工作台，原子维护 Git 资产真相源、生成索引与版本批次
api/: 公共 API 路由层，提供新版 Footer 访问量能力
directory/: 目录页路由，提供分类导航视图

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
