/*
 * [INPUT]: 依赖 types/assets 的资源变体纯函数、routes/admin/types 草稿/库存契约与 filename.ts 文件名诊断
 * [OUTPUT]: 对外提供 single/themed SVG 严格配对、标题/文件名规范化、普通品牌精确匹配、目标识别与批量即时预检
 * [POS]: routes/admin/lib 的客户端草稿规则层，与服务端 library.ts 共用完整主题成对和全资源唯一性语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  listStoredAssetFiles,
  listVariantValues,
  serializeStoredVariant,
  type AssetTheme,
  type AssetVariant,
  type StoredAssetFile,
} from "@/types/assets";
import type { Draft, ExistingAsset, SvgResource } from "../types";
import { getSvgFilenameError } from "./filename";

interface VariantSlots {
  single?: File;
  light?: File;
  dark?: File;
}

interface PairSlots {
  key: string;
  primary: VariantSlots;
  wordmark: VariantSlots;
}

export interface PairedSvgFile {
  key: string;
  primary?: AssetVariant<File>;
  wordmark?: AssetVariant<File>;
}

function filenameParts(filename: string) {
  const stem = filename.replace(/\.svg$/i, "");
  const match = stem.match(/^(.*?)(?:_(wordmark))?(?:_(light|dark))?$/i);
  const base = match?.[1] || stem;
  const role = match?.[2] ? "wordmark" : "primary";
  const theme =
    (match?.[3]?.toLocaleLowerCase() as AssetTheme | undefined) ?? "single";
  return { base, role, theme } as const;
}

export function baseName(filename: string) {
  return filenameParts(filename).base;
}

export function pairingKey(filename: string) {
  return baseName(filename).normalize("NFKC").toLocaleLowerCase();
}

export function cleanTitle(filename: string) {
  return baseName(filename).replace(/[-_]+/g, " ").trim();
}

export function safeFilename(filename: string) {
  const basename = filename
    .replace(/\.svg$/i, "")
    .replace(/[^\p{L}\p{N}_.-]/gu, "");
  return `${basename || "Logo"}.svg`;
}

export function normalizedKey(value: string) {
  return value.trim().normalize("NFKC").toLocaleLowerCase();
}

export function findExistingAssetByPrimaryFilename(
  assets: ExistingAsset[],
  filename: string,
) {
  const key = normalizedKey(filename);
  return assets.find(
    (asset) =>
      typeof asset.file === "string" && normalizedKey(asset.file) === key,
  );
}

export function assetFilenames(asset: ExistingAsset) {
  return [
    ...listStoredAssetFiles(asset.file, `${asset.title} 主 Logo`),
    ...listStoredAssetFiles(asset.wordmark, `${asset.title} Wordmark`),
  ];
}

function sameStoredAsset(left: StoredAssetFile, right: StoredAssetFile) {
  const leftFiles = listStoredAssetFiles(left).map(normalizedKey).sort();
  const rightFiles = listStoredAssetFiles(right).map(normalizedKey).sort();
  return (
    leftFiles.length === rightFiles.length &&
    leftFiles.every((filename, index) => filename === rightFiles[index])
  );
}

export function isDraftTarget(asset: ExistingAsset, draft: Draft) {
  return Boolean(
    draft.operation === "update" &&
      draft.target &&
      asset.category === draft.target.category &&
      sameStoredAsset(asset.file, draft.target.primary),
  );
}

function buildVariant(slots: VariantSlots, label: string) {
  if (slots.single && (slots.light || slots.dark)) {
    throw new Error(`${label}不能同时包含单一版本与 light/dark 版本`);
  }
  if (slots.light || slots.dark) {
    if (!slots.light || !slots.dark) {
      throw new Error(`${label}必须同时提供 light 与 dark 文件`);
    }
    return {
      kind: "themed",
      light: slots.light,
      dark: slots.dark,
    } satisfies AssetVariant<File>;
  }
  return slots.single
    ? ({ kind: "single", file: slots.single } satisfies AssetVariant<File>)
    : undefined;
}

export function pairSvgFiles(fileList: FileList | File[]): PairedSvgFile[] {
  const files = Array.from(fileList).filter(
    (file) => file.type === "image/svg+xml" || /\.svg$/i.test(file.name),
  );
  if (!files.length) throw new Error("请选择 SVG 文件");

  const pairs = new Map<string, PairSlots>();
  for (const file of files) {
    const { role, theme } = filenameParts(file.name);
    const key = pairingKey(file.name);
    const pair = pairs.get(key) ?? {
      key,
      primary: {},
      wordmark: {},
    };
    const slots = pair[role];
    if (slots[theme]) {
      throw new Error(`同一批次无法自动区分重复文件：${file.name}`);
    }
    slots[theme] = file;
    pairs.set(key, pair);
  }

  return [...pairs.values()].map((pair) => ({
    key: pair.key,
    ...(buildVariant(pair.primary, `${pair.key} 主 Logo`)
      ? { primary: buildVariant(pair.primary, `${pair.key} 主 Logo`) }
      : {}),
    ...(buildVariant(pair.wordmark, `${pair.key} Wordmark`)
      ? { wordmark: buildVariant(pair.wordmark, `${pair.key} Wordmark`) }
      : {}),
  }));
}

export function variantResources(variant: AssetVariant<SvgResource>) {
  return listVariantValues(variant);
}

export function variantFilenames(variant: AssetVariant<SvgResource>) {
  return variantResources(variant).map((resource) => resource.filename);
}

export function draftFilenames(draft: Draft) {
  return [
    ...variantFilenames(draft.primary),
    ...(draft.wordmark ? variantFilenames(draft.wordmark) : []),
  ];
}

export function storedDraftPrimary(draft: Draft): StoredAssetFile {
  return serializeStoredVariant(
    draft.primary.kind === "single"
      ? { kind: "single", file: draft.primary.file.filename }
      : {
          kind: "themed",
          light: draft.primary.light.filename,
          dark: draft.primary.dark.filename,
        },
  );
}

export function validateDrafts(
  items: Draft[],
  existingAssets: ExistingAsset[],
) {
  const fileCounts = new Map<string, number>();
  const titleCounts = new Map<string, number>();
  for (const item of items) {
    for (const filename of draftFilenames(item)) {
      const key = normalizedKey(filename);
      fileCounts.set(key, (fileCounts.get(key) ?? 0) + 1);
    }
    const titleKey = normalizedKey(item.title);
    titleCounts.set(titleKey, (titleCounts.get(titleKey) ?? 0) + 1);
  }

  return items.map((item) => {
    const errors: string[] = [];
    const title = item.title.trim();
    const primaryFiles = variantFilenames(item.primary);
    const wordmarkFiles = item.wordmark ? variantFilenames(item.wordmark) : [];

    if (!title) errors.push("缺少展示名称");
    for (const filename of primaryFiles) {
      const error = getSvgFilenameError(filename);
      if (error) errors.push(`主 Logo：${error}`);
    }
    for (const filename of wordmarkFiles) {
      const error = getSvgFilenameError(filename);
      if (error) errors.push(`Wordmark：${error}`);
    }
    if (
      primaryFiles.some((primary) =>
        wordmarkFiles.some(
          (wordmark) => normalizedKey(primary) === normalizedKey(wordmark),
        ),
      )
    ) {
      errors.push("主 Logo 与 Wordmark 文件名相同");
    }
    if (!item.category) errors.push("缺少分类");
    if (item.url.trim()) {
      try {
        const url = new URL(item.url);
        if (!["http:", "https:"].includes(url.protocol))
          errors.push("官网地址无效");
      } catch {
        errors.push("官网地址无效");
      }
    }

    for (const filename of draftFilenames(item)) {
      if ((fileCounts.get(normalizedKey(filename)) ?? 0) > 1) {
        errors.push(`批次内文件名重复：${filename}`);
      }
    }
    if (title && (titleCounts.get(normalizedKey(title)) ?? 0) > 1) {
      errors.push(`批次内展示名称重复：${title}`);
    }

    const others = existingAssets.filter(
      (asset) => !isDraftTarget(asset, item),
    );
    const duplicateTitle =
      title &&
      others.find(
        (asset) => normalizedKey(asset.title) === normalizedKey(title),
      );
    if (duplicateTitle) {
      errors.push(
        `展示名称已存在：${duplicateTitle.title}（${duplicateTitle.category}）`,
      );
    }

    for (const [role, filenames] of [
      ["主 Logo", primaryFiles],
      ["Wordmark", wordmarkFiles],
    ] as const) {
      for (const filename of filenames) {
        const duplicateFile = others.find((asset) =>
          assetFilenames(asset).some(
            (current) => normalizedKey(current) === normalizedKey(filename),
          ),
        );
        if (duplicateFile) {
          errors.push(
            `${role}文件名已被使用：${filename} → ${duplicateFile.title}（${duplicateFile.category}）`,
          );
        }
      }
    }

    return [...new Set(errors)];
  });
}
