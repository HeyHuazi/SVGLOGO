# admin/components/

> L2 | 父级: ../CLAUDE.md

成员清单
DraftCard.svelte: Svelte 品牌草稿编辑单元，呈现并替换 single/themed 主 Logo 与可选 Wordmark、品牌元数据、自动派生的新增/更新状态、写入路径和阻塞错误，通过回调修改父页面批次状态
ReleasePanel.svelte: Svelte changelog 草稿决策面板，编辑发布元信息、呈现未保存/已保存状态、展示品牌级变更条目、执行客户端发布门禁，并以 bits-ui Dialog 确认只影响草稿的移出与清空操作
AssetLibraryPanel.svelte: Svelte 资产检索与维护入口，在浏览器内按展示名称、主 Logo、Wordmark 与分类过滤完整品牌索引；single 品牌选择单文件、themed 品牌选择完整 `_light.svg`/`_dark.svg` 对创建更新草稿

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
