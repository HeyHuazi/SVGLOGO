# data/

> L2 | 父级: ../CLAUDE.md

成员清单
categories.ts: TypeScript 确定性自动生成分类索引，由 src/server/library-index.ts 从 YAML 分类统计编译
changelog.json: JSON 结构化版本日志真相源，保存 releases 与 legacy 历史记录
changelog.ts: TypeScript 更新日志门面，定义版本类型并导出 changelog.json
release-draft.json: JSON dev-only 当前本地更新批次与发布 journal 状态
index.ts: TypeScript 数据门面，将自动生成的 svgs.ts 直接转导为 svgsData，避免运行时假 ID
svgs.ts: TypeScript 确定性自动生成 SVG 条目索引，由 src/server/library-index.ts 从 static/library 编译

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
