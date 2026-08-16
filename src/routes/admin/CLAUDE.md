# admin/

> L2 | 父级: ../CLAUDE.md

成员清单
+page.server.ts: SvelteKit dev-only 服务端加载器，读取本地分类、完整品牌资产清单与发布批次，不访问远程服务
+page.svelte: Svelte 本地品牌资产工作台编排器，自行装配公共 Navbar，只持有跨面板状态与事件流程；编排 single/themed 品牌草稿、自动派生新增/更新、显式 release 保存、批量原子入库与资产维护入口，文件配对、对象 URL 生命周期和 multipart 传输下沉到 lib
admin.css: CSS 局部视觉系统，统一 /admin 面板、字段、按钮、状态 badge、资源预览与列表行，并提供暗色模式，不污染全站 UI primitive
types.ts: TypeScript 客户端契约，复用共享资源变体模型集中品牌草稿、显式更新目标、分类、现有资产与 release state，供页面、components 与 lib 共享
components/: 后台局部界面层，分别封装品牌草稿编辑、changelog 发布决策与现有品牌资产检索
api/: 后台 API 路由层，适配品牌资产 multipart 上传与版本批次读写发布
lib/: 本地资产与发布领域层，统一分类、文件名、SVG、品牌聚合事务和结构化更新日志

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
