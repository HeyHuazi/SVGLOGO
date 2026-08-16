/*
 * [INPUT]: 依赖 static/library、YAML、types/assets 变体模型、共享索引编译器、分类/文件名/SVG 门禁与 release 草稿
 * [OUTPUT]: 对外提供完整品牌查询与变体批量入库；原子维护全部 SVG、元数据、索引和品牌级发布条目
 * [POS]: routes/admin/lib 的品牌资产聚合根与唯一写事务边界，拒绝半套主题、重复资源和无显式目标的更新
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { existsSync } from "node:fs";
import {
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import * as YAML from "yaml";
import {
  listStoredAssetFiles,
  listVariantValues,
  mapVariant,
  parseStoredVariant,
  serializeStoredVariant,
  type AssetVariant,
  type StoredAssetFile,
} from "@/types/assets";
import {
  resolveLibraryIndexPaths,
  writeLibraryIndex,
  type LibraryIndexOptions,
} from "@/server/library-index";
import { isCategoryFolder } from "./catalog";
import { validateSvgFilename } from "./filename";
import { validateAndNormalizeSvg } from "./svg";
import {
  appendReleaseItem,
  DEFAULT_RELEASE_DRAFT,
  readReleaseState,
  type ReleaseChange,
} from "./release";

const DEFAULT_LIBRARY_DIR = resolve(process.cwd(), "static/library");

type MetaItem = {
  title: string;
  file: StoredAssetFile;
  wordmark?: StoredAssetFile;
  url?: string;
  submitter?: string;
  addedAt?: string;
};
type MetaFile = { order?: number; items: MetaItem[] };

export interface ExistingAsset {
  title: string;
  file: StoredAssetFile;
  wordmark?: StoredAssetFile;
  category: string;
  url?: string;
  contributor?: string;
}

export interface SvgResourceInput {
  svg: string;
  filename: string;
}

type ResourceVariantInput = SvgResourceInput | AssetVariant<SvgResourceInput>;

export interface IngestAssetInput {
  operation: Exclude<ReleaseChange, "remove">;
  target?: { category: string; primary: StoredAssetFile };
  primary: ResourceVariantInput;
  wordmark?: ResourceVariantInput;
  category: string;
  title: string;
  url?: string;
  contributor?: string;
}

interface IngestOptions extends LibraryIndexOptions {
  releasePath?: string;
  generateIndex?: (options: LibraryIndexOptions) => Promise<unknown>;
}

interface PreparedResource {
  filename: string;
  svg: string;
  target: string;
}

interface PreparedAsset {
  input: IngestAssetInput;
  primary: AssetVariant<PreparedResource>;
  wordmark?: AssetVariant<PreparedResource>;
  url?: string;
  metaPath: string;
}

interface Snapshot {
  path: string;
  content: string | undefined;
}

let writeQueue = Promise.resolve();

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

function parseMeta(raw: string, path: string): MetaFile {
  const parsed = YAML.parse(raw);
  if (!parsed || !Array.isArray(parsed.items))
    throw new Error(`元数据格式无效: ${path}`);
  for (const [index, item] of parsed.items.entries()) {
    if (!item?.title || !item.file)
      throw new Error(`${path} 第 ${index + 1} 项缺少 title 或 file`);
    parseStoredVariant(item.file, `${path} 第 ${index + 1} 项主 Logo`);
    if (item.wordmark)
      parseStoredVariant(item.wordmark, `${path} 第 ${index + 1} 项 Wordmark`);
  }
  return parsed as MetaFile;
}

function safeTarget(libraryDir: string, category: string, filename: string) {
  const categoryDir = resolve(libraryDir, category);
  const target = resolve(categoryDir, filename);
  if (!target.startsWith(`${categoryDir}/`) || basename(target) !== filename)
    throw new Error("目标路径越界");
  return { categoryDir, target };
}

function normalizeUrl(value: string | undefined) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:")
      throw new Error();
    return url.toString();
  } catch {
    throw new Error("官网必须是有效的 HTTP/HTTPS 地址");
  }
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function normalizedKey(value: string) {
  return value.trim().normalize("NFKC").toLocaleLowerCase();
}

function sameFilename(left: string, right: string) {
  return normalizedKey(left) === normalizedKey(right);
}

function sameStoredAsset(left: StoredAssetFile, right: StoredAssetFile) {
  const leftFiles = listStoredAssetFiles(left).map(normalizedKey).sort();
  const rightFiles = listStoredAssetFiles(right).map(normalizedKey).sort();
  return (
    leftFiles.length === rightFiles.length &&
    leftFiles.every((filename, index) => filename === rightFiles[index])
  );
}

function releaseItemId(
  input: IngestAssetInput,
  filename: string,
  index: number,
) {
  return `${input.category}:${filename}:${Date.now()}-${index}`;
}

function storedPreparedVariant(
  variant: AssetVariant<PreparedResource>,
): StoredAssetFile {
  return serializeStoredVariant(
    mapVariant(variant, (resource) => resource.filename),
  );
}

function variantResources(variant: AssetVariant<PreparedResource> | undefined) {
  return variant ? listVariantValues(variant) : [];
}

function displayFilename(variant: AssetVariant<PreparedResource>) {
  return variant.kind === "single"
    ? variant.file.filename
    : variant.light.filename;
}

async function optionalRead(path: string) {
  return existsSync(path) ? readFile(path, "utf8") : undefined;
}

async function restore(snapshot: Snapshot) {
  if (snapshot.content === undefined) await rm(snapshot.path, { force: true });
  else await writeFile(snapshot.path, snapshot.content, "utf8");
}

export async function getExistingAssets(
  libraryDir = DEFAULT_LIBRARY_DIR,
): Promise<ExistingAsset[]> {
  const assets: ExistingAsset[] = [];
  if (!existsSync(libraryDir)) return assets;

  for (const category of await readdir(libraryDir)) {
    const directory = join(libraryDir, category);
    if (!(await stat(directory)).isDirectory()) continue;
    const metaPath = join(directory, "_meta.yaml");
    if (!existsSync(metaPath)) continue;
    const meta = parseMeta(await readFile(metaPath, "utf8"), metaPath);
    for (const item of meta.items) {
      assets.push({
        title: item.title,
        file: item.file,
        ...(item.wordmark ? { wordmark: item.wordmark } : {}),
        category,
        ...(item.url ? { url: item.url } : {}),
        ...(item.submitter ? { contributor: item.submitter } : {}),
      });
    }
  }
  return assets.sort((left, right) =>
    left.title.localeCompare(right.title, "zh-CN"),
  );
}

export async function getExistingIndex(libraryDir = DEFAULT_LIBRARY_DIR) {
  const assets = await getExistingAssets(libraryDir);
  return {
    files: assets.flatMap((item) => [
      ...listStoredAssetFiles(item.file, `${item.title} 主 Logo`),
      ...listStoredAssetFiles(item.wordmark, `${item.title} Wordmark`),
    ]),
    titles: assets.map((item) => item.title),
  };
}

function prepareResource(
  libraryDir: string,
  category: string,
  resource: SvgResourceInput,
): PreparedResource {
  const filename = validateSvgFilename(resource.filename);
  const { target } = safeTarget(libraryDir, category, filename);
  return { filename, target, svg: validateAndNormalizeSvg(resource.svg) };
}

function inputVariant(
  input: ResourceVariantInput,
): AssetVariant<SvgResourceInput> {
  return "kind" in input ? input : { kind: "single", file: input };
}

function prepareVariant(
  libraryDir: string,
  category: string,
  variant: ResourceVariantInput,
): AssetVariant<PreparedResource> {
  return mapVariant(inputVariant(variant), (resource) =>
    prepareResource(libraryDir, category, resource),
  );
}

function inputStoredVariant(input: ResourceVariantInput): StoredAssetFile {
  return serializeStoredVariant(
    mapVariant(inputVariant(input), (resource) => resource.filename),
  );
}

function targetAsset(existingAssets: ExistingAsset[], input: IngestAssetInput) {
  if (input.operation !== "update") return undefined;
  const target = input.target ?? {
    category: input.category,
    primary: inputStoredVariant(input.primary),
  };
  return existingAssets.find(
    (asset) =>
      asset.category === target.category &&
      sameStoredAsset(asset.file, target.primary),
  );
}

function sameVariantFilenames(
  left: StoredAssetFile,
  right: AssetVariant<PreparedResource>,
) {
  return sameStoredAsset(left, storedPreparedVariant(right));
}

export function ingestSvgAssets(
  inputs: IngestAssetInput[],
  options: IngestOptions = {},
) {
  return serialize(async () => {
    if (!inputs.length) throw new Error("请选择至少一个品牌资产");

    const paths = resolveLibraryIndexPaths(options);
    const libraryDir = options.libraryDir ?? paths.libraryDir;
    const releasePath = options.releasePath ?? DEFAULT_RELEASE_DRAFT;
    const generateIndex = options.generateIndex ?? writeLibraryIndex;
    const prepared: PreparedAsset[] = [];
    const batchFiles = new Set<string>();
    const batchTitles = new Set<string>();

    for (const input of inputs) {
      const fallbackName =
        listVariantValues(inputVariant(input.primary))[0]?.filename || "草稿";
      if (!isCategoryFolder(input.category))
        throw new Error(`${input.title || fallbackName}: 未知分类`);
      if (!input.title?.trim())
        throw new Error(`${fallbackName}: 标题不能为空`);
      const categoryDir = resolve(libraryDir, input.category);
      if (!existsSync(categoryDir))
        throw new Error(`${input.title.trim()}: 分类目录不存在`);

      const title = input.title.trim();
      const primary = prepareVariant(libraryDir, input.category, input.primary);
      const wordmark = input.wordmark
        ? prepareVariant(libraryDir, input.category, input.wordmark)
        : undefined;
      const primaryFiles = variantResources(primary);
      const wordmarkFiles = variantResources(wordmark);
      if (
        primaryFiles.some((left) =>
          wordmarkFiles.some((right) =>
            sameFilename(left.filename, right.filename),
          ),
        )
      ) {
        throw new Error(`${title}: 主 Logo 与 Wordmark 文件名不能相同`);
      }

      for (const resource of [...primaryFiles, ...wordmarkFiles]) {
        const fileKey = normalizedKey(resource.filename);
        if (batchFiles.has(fileKey))
          throw new Error(`批次内文件重复: ${resource.filename}`);
        batchFiles.add(fileKey);
      }
      const titleKey = normalizedKey(title);
      if (batchTitles.has(titleKey))
        throw new Error(`批次内展示名称重复: ${title}`);
      batchTitles.add(titleKey);

      prepared.push({
        input: { ...input, title },
        primary,
        ...(wordmark ? { wordmark } : {}),
        url: normalizeUrl(input.url),
        metaPath: join(categoryDir, "_meta.yaml"),
      });
    }

    const existingAssets = await getExistingAssets(libraryDir);
    for (const asset of prepared) {
      const current = targetAsset(existingAssets, asset.input);
      if (asset.input.operation === "update" && !current) {
        throw new Error(`${asset.input.title}: 待更新的品牌资产不存在`);
      }
      const others = existingAssets.filter((existing) => existing !== current);
      const duplicateTitle = others.find(
        (existing) =>
          normalizedKey(existing.title) === normalizedKey(asset.input.title),
      );
      if (duplicateTitle) {
        throw new Error(
          `${asset.input.title}: 展示名称已存在于 ${duplicateTitle.category}/${listStoredAssetFiles(duplicateTitle.file)[0]}`,
        );
      }

      for (const resource of [
        ...variantResources(asset.primary),
        ...variantResources(asset.wordmark),
      ]) {
        const duplicateFile = others.find((existing) =>
          [
            ...listStoredAssetFiles(existing.file),
            ...listStoredAssetFiles(existing.wordmark),
          ].some((filename) => sameFilename(filename, resource.filename)),
        );
        if (duplicateFile) {
          throw new Error(
            `${asset.input.title}: 文件名 ${resource.filename} 已被 ${duplicateFile.title}（${duplicateFile.category}）使用`,
          );
        }
      }
    }

    const metaByPath = new Map<string, { meta: MetaFile }>();
    for (const asset of prepared) {
      if (metaByPath.has(asset.metaPath)) continue;
      const original = existsSync(asset.metaPath)
        ? await readFile(asset.metaPath, "utf8")
        : "";
      metaByPath.set(asset.metaPath, {
        meta: original ? parseMeta(original, asset.metaPath) : { items: [] },
      });
    }

    const currentByAsset = new Map<
      PreparedAsset,
      { index: number; item?: MetaItem }
    >();
    for (const asset of prepared) {
      const meta = metaByPath.get(asset.metaPath)!.meta;
      const target = asset.input.target ?? {
        category: asset.input.category,
        primary: inputStoredVariant(asset.input.primary),
      };
      const index =
        asset.input.operation === "update"
          ? meta.items.findIndex((item) =>
              sameStoredAsset(item.file, target.primary),
            )
          : -1;
      const current = index >= 0 ? meta.items[index] : undefined;
      currentByAsset.set(asset, { index, item: current });
      const sameTitle = meta.items.some(
        (item, itemIndex) =>
          itemIndex !== index &&
          normalizedKey(item.title) === normalizedKey(asset.input.title),
      );

      if (asset.input.operation === "add") {
        const resources = [
          ...variantResources(asset.primary),
          ...variantResources(asset.wordmark),
        ];
        if (
          sameTitle ||
          resources.some((resource) => existsSync(resource.target))
        ) {
          throw new Error(`${asset.input.title}: 标题或文件已存在`);
        }
        continue;
      }

      if (!current)
        throw new Error(`${asset.input.title}: 待更新的品牌资产不存在`);
      if (sameTitle)
        throw new Error(`${asset.input.title}: 标题已被其他资产使用`);
      if (!sameVariantFilenames(current.file, asset.primary)) {
        throw new Error(
          `${asset.input.title}: 更新主 Logo 时必须沿用现有资源形态和文件名`,
        );
      }
      if (!asset.wordmark) continue;
      if (
        current.wordmark &&
        !sameVariantFilenames(current.wordmark, asset.wordmark)
      ) {
        throw new Error(
          `${asset.input.title}: 更新 Wordmark 时必须沿用现有资源形态和文件名`,
        );
      }
      if (
        !current.wordmark &&
        variantResources(asset.wordmark).some((resource) =>
          existsSync(resource.target),
        )
      ) {
        throw new Error(`${asset.input.title}: Wordmark 文件已存在`);
      }
    }

    let releaseState = await readReleaseState(releasePath);
    prepared.forEach((asset, index) => {
      const meta = metaByPath.get(asset.metaPath)!.meta;
      const currentState = currentByAsset.get(asset)!;
      const current = currentState.item;
      const entry: MetaItem = {
        title: asset.input.title,
        file: storedPreparedVariant(asset.primary),
        ...(asset.wordmark
          ? { wordmark: storedPreparedVariant(asset.wordmark) }
          : current?.wordmark
            ? { wordmark: current.wordmark }
            : {}),
        ...(asset.url ? { url: asset.url } : {}),
        ...(current?.submitter
          ? { submitter: current.submitter }
          : asset.input.contributor?.trim()
            ? { submitter: asset.input.contributor.trim() }
            : {}),
        ...(current?.addedAt
          ? { addedAt: current.addedAt }
          : { addedAt: dateStamp() }),
      };
      if (asset.input.operation === "add") meta.items.push(entry);
      else meta.items[currentState.index] = entry;

      const filename = displayFilename(asset.primary);
      releaseState = appendReleaseItem(releaseState, {
        id: releaseItemId(asset.input, filename, index),
        change: asset.input.operation,
        title: asset.input.title,
        filename,
        category: asset.input.category,
        ...(asset.input.contributor?.trim()
          ? { contributor: asset.input.contributor.trim() }
          : {}),
        createdAt: new Date().toISOString(),
      });
    });

    const snapshots = new Map<string, Snapshot>();
    const snapshot = async (path: string) => {
      if (!snapshots.has(path))
        snapshots.set(path, { path, content: await optionalRead(path) });
    };
    for (const asset of prepared) {
      for (const resource of [
        ...variantResources(asset.primary),
        ...variantResources(asset.wordmark),
      ]) {
        await snapshot(resource.target);
      }
    }
    for (const metaPath of metaByPath.keys()) await snapshot(metaPath);
    await Promise.all([
      snapshot(releasePath),
      snapshot(paths.svgOutput),
      snapshot(paths.categoriesOutput),
    ]);

    const token = `${process.pid}-${Date.now()}`;
    const resources = prepared.flatMap((asset) => [
      ...variantResources(asset.primary),
      ...variantResources(asset.wordmark),
    ]);
    const writes = [
      ...resources.map((resource) => ({
        path: resource.target,
        content: resource.svg,
      })),
      ...[...metaByPath.entries()].map(([path, value]) => ({
        path,
        content: YAML.stringify(
          { ...value.meta, items: value.meta.items },
          { lineWidth: 0 },
        ),
      })),
      {
        path: releasePath,
        content: `${JSON.stringify(releaseState, null, 2)}\n`,
      },
    ];
    const temps = writes.map((write, index) => ({
      ...write,
      temp: `${write.path}.${token}-${index}.tmp`,
    }));

    try {
      await Promise.all(
        temps.map((write) =>
          writeFile(write.temp, write.content, {
            encoding: "utf8",
            flag: "wx",
          }),
        ),
      );
      for (const write of temps) await rename(write.temp, write.path);
      await generateIndex({
        libraryDir,
        svgOutput: paths.svgOutput,
        categoriesOutput: paths.categoriesOutput,
      });
      return {
        count: prepared.length,
        fileCount: resources.length,
        paths: prepared.map(
          (asset) =>
            `static/library/${asset.input.category}/${displayFilename(asset.primary)}`,
        ),
        writtenPaths: resources.map((resource) =>
          resource.target.replace(`${libraryDir}/`, "static/library/"),
        ),
        items: releaseState.active.items.slice(-prepared.length),
      };
    } catch (error) {
      await Promise.all([...snapshots.values()].map(restore));
      throw error;
    } finally {
      await Promise.all(temps.map((write) => rm(write.temp, { force: true })));
    }
  });
}

export async function ingestSvgAsset(
  input: IngestAssetInput,
  options: IngestOptions = {},
) {
  const result = await ingestSvgAssets([input], options);
  return { path: result.paths[0], item: result.items[0] };
}
