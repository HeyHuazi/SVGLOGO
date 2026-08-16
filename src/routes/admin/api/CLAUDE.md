# admin/api/

> L2 | 父级: ../CLAUDE.md

成员清单
batch/+server.ts: SvelteKit dev-only GET/PATCH/POST 适配器，读取、编辑、单条移出、整批清空并发布本地版本批次；草稿撤销不触碰已入库资产
upload/+server.ts: SvelteKit dev-only multipart 适配器，校验 primary/wordmark 的 single 或完整 light/dark 文件槽位与元数据一致性，组装品牌聚合后调用唯一批量事务

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
