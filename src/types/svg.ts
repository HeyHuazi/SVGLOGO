/*
 * [INPUT]: 依赖 types/categories 的分类联合类型与 types/assets 的共享资源契约
 * [OUTPUT]: 对外提供兼容别名 ThemeOptions 与 iSVG，描述主 Logo、wordmark 和可选官网
 * [POS]: types 的 SVG 数据契约，被生成索引、页面和操作组件共同消费，主题完整性由共享资产模型保证
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { StoredAssetFile, StoredThemeFile } from "./assets";
import type { tCategory } from "./categories";

type CategoryPair = [tCategory, tCategory];
type CategoryTriple = [tCategory, tCategory, tCategory];

export type ThemeOptions = StoredThemeFile;

export interface iSVG {
  id?: number;
  title: string;
  category: tCategory | CategoryPair | CategoryTriple;
  route: StoredAssetFile;
  wordmark?: StoredAssetFile;
  url?: string;
}
