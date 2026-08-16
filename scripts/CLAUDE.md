# scripts/
> L2 | 父级: ../CLAUDE.md

成员清单
check-generated.ts: TypeScript 生成漂移门禁，调用共享编译器在内存中比较当前索引，保证 CI 绝对只读
check-size.ts: TypeScript 尺寸门禁，递归检查 static/library 中超过 200KB 的 SVG，prebuild 调用
fix-viewbox.ts: TypeScript 资产修复器，为缺少 viewBox 的 SVG 依据 width/height 补齐
generate-svgs.ts: TypeScript 薄 CLI，调用 src/server/library-index 原子生成 src/data/svgs.ts 与 categories.ts
migrate-svgs.ts: TypeScript 迁移脚本，辅助旧 SVG 元数据迁移到当前 library 结构
scan-svgs.ts: TypeScript 资产扫描器，默认供 check:library 只读检查，--write 仅供 repair:library-meta 维护恢复；存在性检查基于 readdir 真实文件名（大小写敏感，防 Linux 部署 404），并对大小写折叠的重复文件引用给出提示（不计入退出码）
title-mappings.json: 标题映射表，为生成器提供品牌标题规范化数据

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
