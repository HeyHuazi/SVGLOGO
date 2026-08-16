/*
 * [INPUT]: 依赖 vitest、临时 release draft 与本地 release 发布领域
 * [OUTPUT]: 验证草稿 fallback、旧字段迁移、journal 持久化、单条移出、整批清空与发布中修改保护
 * [POS]: routes/admin/lib 的发布状态测试，保护本地 changelog 草稿的兼容性和可撤销边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let root = '';
let draft = '';

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'svglogo-release-'));
  draft = join(root, 'draft.json');
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

describe('release state', () => {
  it('returns an empty state when draft is missing', async () => {
    const { readReleaseState } = await import('./release');
    await expect(readReleaseState(draft)).resolves.toEqual({
      schemaVersion: 1,
      active: { version: '', date: '', summary: '', items: [] },
      publishing: null
    });
  });

  it('strips legacy remote source state while reading', async () => {
    const { readReleaseState } = await import('./release');
    await writeFile(draft, JSON.stringify({
      schemaVersion: 1,
      active: {
        version: '', date: '', summary: '',
        items: [{
          id: 'company:Old.svg:1', change: 'add', title: '旧条目', filename: 'Old.svg', category: 'company',
          source: { kind: 'notion', pageId: 'legacy', stageStatus: 'pending' }, createdAt: '2026-07-18T00:00:00.000Z'
        }]
      },
      notionSync: { pageIds: ['legacy'] }
    }));
    const state = await readReleaseState(draft);
    expect(state.active.items[0]).not.toHaveProperty('source');
    expect(state).not.toHaveProperty('notionSync');
  });

  it('persists the local publishing journal shape', async () => {
    const { readReleaseState, writeReleaseStateAtomic } = await import('./release');
    const state = await readReleaseState(draft);
    state.publishing = {
      release: {
        version: '4.3.0', date: '2026.07.18', summary: '测试',
        changes: { added: [], updated: [], removed: [] }, contributors: []
      }
    };
    await writeReleaseStateAtomic(state, draft);
    expect(JSON.parse(await readFile(draft, 'utf8')).publishing).toEqual({ release: state.publishing.release });
  });

  it('removes one changelog draft item without touching the others', async () => {
    const { removeReleaseDraftItem, writeReleaseStateAtomic } = await import('./release');
    await writeReleaseStateAtomic({
      schemaVersion: 1,
      active: {
        version: '4.3.0', date: '2026.07.18', summary: '批量更新',
        items: [
          { id: 'company:One.svg:1', change: 'add', title: '品牌一', filename: 'One.svg', category: 'company', createdAt: '2026-07-18T00:00:00.000Z' },
          { id: 'company:Two.svg:2', change: 'add', title: '品牌二', filename: 'Two.svg', category: 'company', createdAt: '2026-07-18T00:00:01.000Z' }
        ]
      },
      publishing: null
    }, draft);

    const state = await removeReleaseDraftItem('company:One.svg:1', draft);
    expect(state.active).toMatchObject({ version: '4.3.0', date: '2026.07.18', summary: '批量更新' });
    expect(state.active.items.map((item) => item.id)).toEqual(['company:Two.svg:2']);
  });

  it('clears changelog draft metadata and items', async () => {
    const { clearReleaseDraft, writeReleaseStateAtomic } = await import('./release');
    await writeReleaseStateAtomic({
      schemaVersion: 1,
      active: {
        version: '4.3.0', date: '2026.07.18', summary: '批量更新',
        items: [{ id: 'company:One.svg:1', change: 'add', title: '品牌一', filename: 'One.svg', category: 'company', createdAt: '2026-07-18T00:00:00.000Z' }]
      },
      publishing: null
    }, draft);

    await expect(clearReleaseDraft(draft)).resolves.toEqual({
      schemaVersion: 1,
      active: { version: '', date: '', summary: '', items: [] },
      publishing: null
    });
  });

  it('rejects release draft mutations while a publishing journal exists', async () => {
    const { clearReleaseDraft, removeReleaseDraftItem, writeReleaseStateAtomic } = await import('./release');
    await writeReleaseStateAtomic({
      schemaVersion: 1,
      active: {
        version: '4.3.0', date: '2026.07.18', summary: '批量更新',
        items: [{ id: 'company:One.svg:1', change: 'add', title: '品牌一', filename: 'One.svg', category: 'company', createdAt: '2026-07-18T00:00:00.000Z' }]
      },
      publishing: {
        release: {
          version: '4.3.0', date: '2026.07.18', summary: '批量更新',
          changes: { added: [], updated: [], removed: [] }, contributors: []
        }
      }
    }, draft);

    await expect(removeReleaseDraftItem('company:One.svg:1', draft)).rejects.toThrow('发布进行中，暂不能修改批次');
    await expect(clearReleaseDraft(draft)).rejects.toThrow('发布进行中，暂不能修改批次');
  });
});
