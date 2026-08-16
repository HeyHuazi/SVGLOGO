/*
 * [INPUT]: 依赖 release draft、结构化 changelog 与 node 文件系统
 * [OUTPUT]: 对外提供本地发布草稿读写、条目登记、单条移出、整批清空与幂等 changelog 发布
 * [POS]: routes/admin/lib 的版本发布领域，只维护本地 journal 与更新日志，不执行资产删除、Git、构建或远程同步
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { ReleaseChangeItem, ReleaseEntry } from '@/data/changelog';

export type ReleaseChange = 'add' | 'update' | 'remove';

export interface ReleaseDraftItem {
  id: string;
  change: ReleaseChange;
  title: string;
  filename: string;
  category: string;
  contributor?: string;
  createdAt: string;
}

interface PublishingJournal {
  release: ReleaseEntry;
}

export interface ReleaseState {
  schemaVersion: 1;
  active: { version: string; date: string; summary: string; items: ReleaseDraftItem[] };
  publishing?: PublishingJournal | null;
}

export const DEFAULT_RELEASE_DRAFT = resolve(process.cwd(), 'src/data/release-draft.json');
const DEFAULT_CHANGELOG = resolve(process.cwd(), 'src/data/changelog.json');

export const EMPTY_RELEASE_STATE: ReleaseState = {
  schemaVersion: 1,
  active: { version: '', date: '', summary: '', items: [] },
  publishing: null
};

async function atomicJson(path: string, value: unknown) {
  const temp = `${path}.${process.pid}-${Date.now()}.tmp`;
  try {
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temp, path);
  } finally {
    await rm(temp, { force: true });
  }
}

export async function readReleaseState(path = DEFAULT_RELEASE_DRAFT): Promise<ReleaseState> {
  try {
    const raw = JSON.parse(await readFile(path, 'utf8')) as ReleaseState & Record<string, unknown>;
    return {
      schemaVersion: 1,
      active: {
        ...raw.active,
        items: raw.active.items.map(({ source: _source, ...item }: ReleaseDraftItem & { source?: unknown }) => item)
      },
      publishing: raw.publishing ? { release: raw.publishing.release } : null
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return structuredClone(EMPTY_RELEASE_STATE);
  }
}

export const writeReleaseStateAtomic = (state: ReleaseState, path = DEFAULT_RELEASE_DRAFT) => atomicJson(path, state);

export function appendReleaseItem(state: ReleaseState, item: ReleaseDraftItem): ReleaseState {
  if (state.active.items.some((current) =>
    current.category === item.category && current.filename === item.filename && current.change === item.change
  )) {
    throw new Error('该图标已存在于本次更新');
  }
  return { ...state, active: { ...state.active, items: [...state.active.items, item] } };
}

function assertReleaseMutable(state: ReleaseState) {
  if (state.publishing) throw new Error('发布进行中，暂不能修改批次');
}

export async function removeReleaseDraftItem(id: string, path = DEFAULT_RELEASE_DRAFT) {
  if (!id.trim()) throw new Error('缺少要移出的更新条目');
  const state = await readReleaseState(path);
  assertReleaseMutable(state);
  if (!state.active.items.some((item) => item.id === id)) throw new Error('本次更新中不存在该条目');
  const next = {
    ...state,
    active: { ...state.active, items: state.active.items.filter((item) => item.id !== id) }
  };
  await writeReleaseStateAtomic(next, path);
  return next;
}

export async function clearReleaseDraft(path = DEFAULT_RELEASE_DRAFT) {
  const state = await readReleaseState(path);
  assertReleaseMutable(state);
  const next = {
    ...state,
    active: { version: '', date: '', summary: '', items: [] }
  };
  await writeReleaseStateAtomic(next, path);
  return next;
}

export async function updateReleaseDraft(active: ReleaseState['active']) {
  const state = await readReleaseState();
  assertReleaseMutable(state);
  const next = { ...state, active };
  await writeReleaseStateAtomic(next);
  return next;
}

function releaseEntry(state: ReleaseState): ReleaseEntry {
  const groups: ReleaseEntry['changes'] = { added: [], updated: [], removed: [] };
  for (const item of state.active.items) {
    const value: ReleaseChangeItem = {
      title: item.title,
      filename: item.filename,
      category: item.category,
      ...(item.contributor ? { contributor: item.contributor } : {})
    };
    groups[item.change === 'add' ? 'added' : item.change === 'update' ? 'updated' : 'removed'].push(value);
  }
  return {
    version: state.active.version,
    date: state.active.date,
    summary: state.active.summary,
    changes: groups,
    contributors: [...new Set(state.active.items.map((item) => item.contributor).filter(Boolean))] as string[]
  };
}

function validateDraft(state: ReleaseState) {
  if (!/^\d+\.\d+\.\d+$/.test(state.active.version)) throw new Error('版本号必须是 x.y.z');
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(state.active.date)) throw new Error('日期必须是 YYYY.MM.DD');
  if (!state.active.summary.trim()) throw new Error('请填写本次更新说明');
  if (!state.active.items.length) throw new Error('本次更新没有条目');
}

function sameRelease(left: ReleaseEntry, right: ReleaseEntry) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export async function publishReleaseBatch() {
  let state = await readReleaseState();

  if (!state.publishing) {
    validateDraft(state);
    state.publishing = { release: releaseEntry(state) };
    await writeReleaseStateAtomic(state);
  }

  const journal = state.publishing;
  const changelog = JSON.parse(await readFile(DEFAULT_CHANGELOG, 'utf8'));
  const existing = changelog.releases.find((entry: ReleaseEntry) => entry.version === journal.release.version);
  if (existing && !sameRelease(existing, journal.release)) throw new Error('同版本更新日志内容冲突');
  if (!existing) {
    changelog.releases.unshift(journal.release);
    await atomicJson(DEFAULT_CHANGELOG, changelog);
  }

  state = await readReleaseState();
  state = {
    ...state,
    active: { version: '', date: '', summary: '', items: [] },
    publishing: null
  };
  await writeReleaseStateAtomic(state);
  return state;
}
