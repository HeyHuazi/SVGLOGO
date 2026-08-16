# lib/

> L2 | 父级: ../CLAUDE.md

成员清单
admin-api.ts: TypeScript 浏览器侧后台 HTTP 适配器，按 primary/wordmark 与 single/light/dark 槽位封装 multipart 上传，并管理 release 草稿保存、移出/清空与发布请求
draft-rules.ts: TypeScript 客户端草稿规则层，集中普通/主题 Logo 与 Wordmark 严格配对、文件名/标题清洗、普通主 Logo 精确匹配、全部变体展开、显式 update 目标识别与批量即时预检
draft-rules.test.ts: Vitest 客户端规则测试，覆盖普通/主题资源配对、半套主题拒绝、NFKC 精确匹配、wordmark-only fallback、批内重复、全库主题资源冲突、update 自身放行与 URL 门禁
draft-state.ts: TypeScript 客户端草稿状态层，管理 File 到 single/themed 新增/更新 Draft 的转换、显式目标继承、重复更新替换、全部 Object URL 生命周期、资源变体替换/移除与批量默认值
draft-state.test.ts: Vitest 客户端状态测试，覆盖普通品牌自动 update、主题新增/更新、规范文件名继承、重复目标预览释放和隐式形态变更拒绝
catalog.ts: TypeScript admin 分类适配器，复用 src/config/categories 提供选项与分类校验
filename.ts: TypeScript 共享文件名规则，生成 SVG basename、返回具体错误诊断并阻断路径穿越，供页面预检与服务端事务复用
filename.test.ts: Vitest 文件名边界测试，覆盖品牌映射、具体错误文案与非法路径
library.ts: TypeScript 本地品牌资产领域服务，以主 Logo 加可选 Wordmark 为聚合根，统一 single/themed 批量 add/update，在写入前拒绝半套主题并检查全库展示名与全部变体文件名冲突，再原子写所有 SVG、元数据、品牌级 release 条目并只生成一次前端索引
library.test.ts: Vitest 临时目录集成测试，覆盖普通/主题 Logo 与 Wordmark 聚合、多分类批量入库、更新关联保留、资源形态门禁、批内/全库冲突、危险 SVG 零写入及生成失败完整回滚
release.ts: TypeScript 本地版本批次领域，持久化发布 journal、登记资产条目，支持单条移出与整批清空 changelog 草稿，并幂等写入结构化 changelog；不负责删除已入库资产
release.test.ts: Vitest 发布状态测试，覆盖缺失草稿 fallback、旧远程字段迁移、journal 持久化、单条移出、整批清空与发布中修改保护
svg.ts: TypeScript SVG 入库校验器，剥离合法 DOCTYPE，拒绝危险内容并统一视图尺寸
svg.test.ts: Vitest SVG 安全测试，覆盖尺寸规范化与危险内容拒绝

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
