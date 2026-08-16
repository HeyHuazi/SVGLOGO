/*
 * [INPUT]: 依赖 src/data/changelog.json 的结构化版本与历史日志
 * [OUTPUT]: 对外提供 ReleaseEntry、LegacyChangelogEntry、releaseData、legacyChangelogData 与兼容 changelogData
 * [POS]: data 的更新日志门面，被 about 页面与版本批次展示消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import data from './changelog.json';

export interface ReleaseChangeItem {
  title: string;
  filename: string;
  category: string;
  contributor?: string;
}

export interface ReleaseEntry {
  version: string;
  date: string;
  summary: string;
  changes: {
    added: ReleaseChangeItem[];
    updated: ReleaseChangeItem[];
    removed: ReleaseChangeItem[];
  };
  contributors: string[];
}

export interface LegacyChangelogEntry {
  date: string;
  type: 'add' | 'fix' | 'announce' | 'remove';
  description: string;
  contributor?: string;
}

export const releaseData = data.releases as ReleaseEntry[];
export const legacyChangelogData = data.legacy as LegacyChangelogEntry[];
export const changelogData = legacyChangelogData;

export function getLatestChangelog(count = 5): LegacyChangelogEntry[] {
  return legacyChangelogData.slice(0, count);
}
