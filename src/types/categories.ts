/*
 * [INPUT]: 依赖 src/config/categories 的 categoriesConfig 常量
 * [OUTPUT]: 对外提供 tCategory 分类联合类型
 * [POS]: types 的分类契约，由单一配置推导并约束 SVG 条目的 category 字段
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { CategoryName } from '@/config/categories';

export type tCategory = '全部' | CategoryName;
