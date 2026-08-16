/*
 * [INPUT]: 依赖 src/config/categories 的分类真相源
 * [OUTPUT]: 对外提供 admin 分类选项、分类校验与标题推断能力
 * [POS]: routes/admin/lib 的分类适配器，隔离管理界面与项目分类配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  categoriesConfig,
  inferCategory,
  isCategoryFolder,
  type CategoryFolder
} from '@/config/categories';

export { inferCategory, isCategoryFolder };
export type { CategoryFolder };

export const adminCategories = categoriesConfig.map(({ folder, displayName }) => ({
  folder,
  name: displayName
}));
