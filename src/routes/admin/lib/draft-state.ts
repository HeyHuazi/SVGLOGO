/*
 * [INPUT]: 依赖浏览器 File/ObjectURL、types/assets 资源变体、routes/admin/types 与 draft-rules 严格配对/匹配规则
 * [OUTPUT]: 对外提供 single/themed 品牌草稿创建、既有品牌更新、资源替换/移除、清理与批量默认值应用
 * [POS]: routes/admin/lib 的客户端草稿状态层，守护品牌聚合根、显式更新目标和全部变体预览生命周期
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  listStoredAssetFiles,
  listVariantValues,
  parseStoredVariant,
  type AssetVariant,
} from "@/types/assets";
import type { Draft, ExistingAsset, SvgResource } from "../types";
import {
  cleanTitle,
  findExistingAssetByPrimaryFilename,
  pairSvgFiles,
  pairingKey,
  safeFilename,
  variantFilenames,
} from "./draft-rules";

interface DraftDefaults {
  category: string;
  contributor: string;
}

export function resource(file: File): SvgResource {
  return {
    file,
    preview: URL.createObjectURL(file),
    filename: safeFilename(file.name),
  };
}

function resourceVariant(files: AssetVariant<File>): AssetVariant<SvgResource> {
  return files.kind === "single"
    ? { kind: "single", file: resource(files.file) }
    : {
        kind: "themed",
        light: resource(files.light),
        dark: resource(files.dark),
      };
}

function canonicalResourceVariant(
  files: AssetVariant<File>,
  filenames: ReturnType<typeof parseStoredVariant>,
): AssetVariant<SvgResource> {
  if (files.kind !== filenames.kind) {
    throw new Error("更新资源形态与既有品牌不一致");
  }
  return files.kind === "single" && filenames.kind === "single"
    ? {
        kind: "single",
        file: { ...resource(files.file), filename: filenames.file },
      }
    : files.kind === "themed" && filenames.kind === "themed"
      ? {
          kind: "themed",
          light: { ...resource(files.light), filename: filenames.light },
          dark: { ...resource(files.dark), filename: filenames.dark },
        }
      : (() => {
          throw new Error("更新资源形态与既有品牌不一致");
        })();
}

function firstFile(variant: AssetVariant<File>) {
  return variant.kind === "single" ? variant.file : variant.light;
}

export function createDraft(
  primaryFiles: AssetVariant<File>,
  defaults: DraftDefaults,
  wordmarkFiles?: AssetVariant<File>,
): Draft {
  return {
    id: crypto.randomUUID(),
    primary: resourceVariant(primaryFiles),
    ...(wordmarkFiles ? { wordmark: resourceVariant(wordmarkFiles) } : {}),
    operation: "add",
    title: cleanTitle(firstFile(primaryFiles).name),
    category: defaults.category,
    url: "",
    contributor: defaults.contributor,
  };
}

export function createUpdateDraft(
  primaryFiles: AssetVariant<File>,
  asset: ExistingAsset,
  wordmarkFiles?: AssetVariant<File>,
): Draft {
  return {
    id: crypto.randomUUID(),
    primary: canonicalResourceVariant(
      primaryFiles,
      parseStoredVariant(asset.file, `${asset.title} 主 Logo`),
    ),
    ...(wordmarkFiles
      ? {
          wordmark: asset.wordmark
            ? canonicalResourceVariant(
                wordmarkFiles,
                parseStoredVariant(asset.wordmark, `${asset.title} Wordmark`),
              )
            : resourceVariant(wordmarkFiles),
        }
      : {}),
    target: { category: asset.category, primary: asset.file },
    operation: "update",
    title: asset.title,
    category: asset.category,
    url: asset.url ?? "",
    contributor: asset.contributor ?? "",
  };
}

function releaseVariant(variant: AssetVariant<SvgResource> | undefined) {
  if (!variant) return;
  listVariantValues(variant).forEach((item) =>
    URL.revokeObjectURL(item.preview),
  );
}

function replacePrimary(
  draft: Draft,
  files: AssetVariant<File>,
  wordmarkFiles?: AssetVariant<File>,
) {
  const currentFilenames =
    draft.primary.kind === "single"
      ? ({ kind: "single", file: draft.primary.file.filename } as const)
      : ({
          kind: "themed",
          light: draft.primary.light.filename,
          dark: draft.primary.dark.filename,
        } as const);
  releaseVariant(draft.primary);
  if (wordmarkFiles) releaseVariant(draft.wordmark);

  const primary = canonicalResourceVariant(files, currentFilenames);
  let wordmark = draft.wordmark;
  if (wordmarkFiles) {
    const existingWordmark = draft.wordmark
      ? draft.wordmark.kind === "single"
        ? ({ kind: "single", file: draft.wordmark.file.filename } as const)
        : ({
            kind: "themed",
            light: draft.wordmark.light.filename,
            dark: draft.wordmark.dark.filename,
          } as const)
      : undefined;
    wordmark = existingWordmark
      ? canonicalResourceVariant(wordmarkFiles, existingWordmark)
      : resourceVariant(wordmarkFiles);
  }
  return { ...draft, primary, ...(wordmark ? { wordmark } : {}) };
}

function sameTarget(draft: Draft, asset: ExistingAsset) {
  if (draft.operation !== "update" || !draft.target) return false;
  const left = listStoredAssetFiles(draft.target.primary).map((item) =>
    item.normalize("NFKC").toLocaleLowerCase(),
  );
  const right = listStoredAssetFiles(asset.file).map((item) =>
    item.normalize("NFKC").toLocaleLowerCase(),
  );
  return (
    draft.target.category === asset.category &&
    left.length === right.length &&
    left.every((filename) => right.includes(filename))
  );
}

export function upsertUpdateDraft(
  drafts: Draft[],
  primaryFiles: AssetVariant<File>,
  asset: ExistingAsset,
  wordmarkFiles?: AssetVariant<File>,
) {
  const target = drafts.find((draft) => sameTarget(draft, asset));
  if (!target) {
    return [...drafts, createUpdateDraft(primaryFiles, asset, wordmarkFiles)];
  }
  return drafts.map((draft) =>
    draft.id === target.id
      ? replacePrimary(draft, primaryFiles, wordmarkFiles)
      : draft,
  );
}

function addPrimaryPair(
  drafts: Draft[],
  primary: AssetVariant<File>,
  defaults: DraftDefaults,
  existingAssets: ExistingAsset[],
  wordmark?: AssetVariant<File>,
) {
  if (primary.kind === "single") {
    const filename = safeFilename(primary.file.name);
    const existing = findExistingAssetByPrimaryFilename(
      existingAssets,
      filename,
    );
    if (existing) {
      return upsertUpdateDraft(drafts, primary, existing, wordmark);
    }
  }
  return [...drafts, createDraft(primary, defaults, wordmark)];
}

function samePairingKey(draft: Draft, key: string) {
  return variantFilenames(draft.primary).some(
    (filename) => pairingKey(filename) === key,
  );
}

export function addFilesToDrafts(
  drafts: Draft[],
  fileList: FileList | File[],
  defaults: DraftDefaults,
  existingAssets: ExistingAsset[] = [],
) {
  const pairs = pairSvgFiles(fileList);
  let next = [...drafts];

  for (const pair of pairs) {
    if (pair.primary) {
      const matchingDraft = next.find(
        (draft) => samePairingKey(draft, pair.key) && !draft.wordmark,
      );
      if (matchingDraft && pair.wordmark) {
        next = next.map((draft) =>
          draft.id === matchingDraft.id
            ? matchingDraft.operation === "update"
              ? replacePrimary(draft, pair.primary!, pair.wordmark)
              : { ...draft, wordmark: resourceVariant(pair.wordmark!) }
            : draft,
        );
      } else {
        next = addPrimaryPair(
          next,
          pair.primary,
          defaults,
          existingAssets,
          pair.wordmark,
        );
      }
      continue;
    }

    if (!pair.wordmark) continue;
    const matchingDraft = next.find(
      (draft) => samePairingKey(draft, pair.key) && !draft.wordmark,
    );
    if (matchingDraft) {
      next = next.map((draft) =>
        draft.id === matchingDraft.id
          ? { ...draft, wordmark: resourceVariant(pair.wordmark!) }
          : draft,
      );
    } else {
      next.push(createDraft(pair.wordmark, defaults));
    }
  }

  return next;
}

export function releaseDraftPreviews(draft: Draft) {
  releaseVariant(draft.primary);
  releaseVariant(draft.wordmark);
}

export function replacePrimaryVariant(
  drafts: Draft[],
  id: string,
  files: AssetVariant<File>,
) {
  return drafts.map((draft) => {
    if (draft.id !== id) return draft;
    return replacePrimary(draft, files);
  });
}

export function replaceWordmark(
  drafts: Draft[],
  id: string,
  files: AssetVariant<File>,
) {
  return drafts.map((draft) => {
    if (draft.id !== id) return draft;
    releaseVariant(draft.wordmark);
    return { ...draft, wordmark: resourceVariant(files) };
  });
}

export function removeWordmarkFromDraft(drafts: Draft[], id: string) {
  return drafts.map((draft) => {
    if (draft.id !== id) return draft;
    releaseVariant(draft.wordmark);
    return { ...draft, wordmark: undefined };
  });
}

export function removeDraftFromList(drafts: Draft[], id: string) {
  const target = drafts.find((draft) => draft.id === id);
  if (target) releaseDraftPreviews(target);
  return drafts.filter((draft) => draft.id !== id);
}

export function clearDraftList(drafts: Draft[]) {
  drafts.forEach(releaseDraftPreviews);
  return [] as Draft[];
}

export function applyDefaultsToDrafts(
  drafts: Draft[],
  defaults: DraftDefaults,
) {
  return drafts.map((draft) => ({
    ...draft,
    category: defaults.category,
    ...(defaults.contributor.trim()
      ? { contributor: defaults.contributor.trim() }
      : {}),
  }));
}
