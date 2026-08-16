/*
 * [INPUT]: 依赖浏览器 File、本地资产索引数据与 types/assets 的共享资源变体契约
 * [OUTPUT]: 对外提供后台工作台的变体品牌草稿、资源、分类、release 与现有资产类型
 * [POS]: routes/admin 的客户端契约层，连接页面状态编排、multipart 适配与局部工作区组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { AssetVariant, StoredAssetFile } from "@/types/assets";

export type Operation = "add" | "update";
export type AssetFile = StoredAssetFile;

export interface SvgResource {
  file: File;
  preview: string;
  filename: string;
}

export interface DraftTarget {
  category: string;
  primary: AssetFile;
}

export interface Draft {
  id: string;
  primary: AssetVariant<SvgResource>;
  wordmark?: AssetVariant<SvgResource>;
  target?: DraftTarget;
  operation: Operation;
  title: string;
  category: string;
  url: string;
  contributor: string;
}

export interface ExistingAsset {
  title: string;
  file: AssetFile;
  wordmark?: AssetFile;
  category: string;
  url?: string;
  contributor?: string;
}

export interface AdminCategory {
  folder: string;
  name: string;
}

export type ReleaseChange = "add" | "update" | "remove";

export interface ReleaseItem {
  id: string;
  change: ReleaseChange;
  title: string;
  filename: string;
  category: string;
  contributor?: string;
  createdAt: string;
}

export interface ReleaseState {
  schemaVersion: 1;
  active: {
    version: string;
    date: string;
    summary: string;
    items: ReleaseItem[];
  };
  publishing?: unknown;
}
