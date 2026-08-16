# types/

> L2 | 父级: ../CLAUDE.md

成员清单
assets.ts: TypeScript 品牌资源本体模型，定义 single/themed 判别联合及旧存储格式的解析、序列化、映射、枚举与主题选择纯函数，拒绝半套 light/dark
assets.test.ts: Vitest 资产本体契约测试，覆盖旧字符串兼容、完整主题规范化、映射/枚举和半套主题拒绝
categories.ts: TypeScript 分类类型定义，从 src/config/categories 的单一配置推导 SVG 分类联合类型
svg.ts: TypeScript SVG 条目类型定义，复用共享存储资源契约描述主 Logo、wordmark 与多分类结构

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
