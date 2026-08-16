/*
 * [INPUT]: 依赖 src/data/changelog.json 的结构化版本与历史日志
 * [OUTPUT]: 对外提供 ReleaseEntry、LegacyChangelogEntry、releaseData、legacyChangelogData、changelogEntries（releases 归一化为 legacy 形状后与 legacy 合并，按日期倒序）与兼容 changelogData
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

function titles(items: ReleaseChangeItem[]) {
  return items.map((item) => item.title);
}

/** 将结构化 release 归一化为 legacy 形状，供统一“更新日志”时间线展示 */
function normalizeRelease(release: ReleaseEntry): LegacyChangelogEntry {
  const parts: string[] = [];
  if (release.changes.added.length)
    parts.push(`新增：${titles(release.changes.added).join('、')}`);
  if (release.changes.updated.length)
    parts.push(`更新：${titles(release.changes.updated).join('、')}`);
  if (release.changes.removed.length)
    parts.push(`删除：${titles(release.changes.removed).join('、')}`);
  // 有变化条目时以条目列表为准（类型标题已表达动作），无条目时用 summary 兑底
  const withSummary =
    parts.length || !release.summary.trim()
      ? parts.join('；')
      : release.summary.trim();
  const inlineContributor =
    release.changes.added[0]?.contributor ??
    release.changes.updated[0]?.contributor ??
    release.changes.removed[0]?.contributor;
  const contributors = release.contributors.join('、');
  const contributor = inlineContributor || contributors || undefined;

  const entry: LegacyChangelogEntry = {
    date: release.date,
    type: release.changes.added.length
      ? 'add'
      : release.changes.updated.length
        ? 'fix'
        : release.changes.removed.length
          ? 'remove'
          : 'announce',
    description: withSummary,
  };
  if (contributor) entry.contributor = contributor;
  return entry;
}

/** 统一更新日志：releases 归一化后与 legacy 合并，按日期倒序（YYYY.MM.DD 可直接字典序） */
export const changelogEntries: LegacyChangelogEntry[] = [
  ...legacyChangelogData,
  ...releaseData.map(normalizeRelease),
].sort((a, b) => b.date.localeCompare(a.date));
