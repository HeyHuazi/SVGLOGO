/*
 * [INPUT]: 依赖 static/library 分类 YAML、src/config/categories 分类真相源、types/assets 资源规范与 Node 文件系统
 * [OUTPUT]: 对外提供 buildLibraryIndex、writeLibraryIndex 与索引路径解析能力；拒绝不完整 light/dark 主题资源
 * [POS]: server 的资产编译核心，被 Admin 入库事务、CLI 生成入口与生成漂移门禁共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { existsSync } from "node:fs";
import { readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import * as YAML from "yaml";
import { categoriesConfig, getCategoryByFolder } from "../config/categories";
import {
  mapVariant,
  parseStoredVariant,
  serializeStoredVariant,
  type StoredAssetFile,
} from "../types/assets";

type MetaItem = {
  title: string;
  file: StoredAssetFile;
  wordmark?: StoredAssetFile;
  url?: string;
  addedAt?: string;
};
type MetaFile = { order?: number; items: MetaItem[] };
type RouteValue = StoredAssetFile;
type GeneratedSvg = {
  title: string;
  category: string;
  route: RouteValue;
  wordmark?: RouteValue;
  url?: string;
  addedAt?: string;
};

export interface LibraryIndexOptions {
  libraryDir?: string;
  svgOutput?: string;
  categoriesOutput?: string;
}

export interface LibraryIndexPaths {
  libraryDir: string;
  svgOutput: string;
  categoriesOutput: string;
}

export interface LibraryIndexBuild extends LibraryIndexPaths {
  svgSource: string;
  categoriesSource: string;
  count: number;
}

const PROJECT_ROOT = process.cwd();

export function resolveLibraryIndexPaths(
  options: LibraryIndexOptions = {},
): LibraryIndexPaths {
  return {
    libraryDir: options.libraryDir ?? resolve(PROJECT_ROOT, "static/library"),
    svgOutput: options.svgOutput ?? resolve(PROJECT_ROOT, "src/data/svgs.ts"),
    categoriesOutput:
      options.categoriesOutput ??
      resolve(PROJECT_ROOT, "src/data/categories.ts"),
  };
}

function routeValue(
  file: StoredAssetFile,
  folder: string,
  context: string,
): RouteValue {
  return serializeStoredVariant(
    mapVariant(
      parseStoredVariant(file, context),
      (filename) => `/library/${folder}/${filename}`,
    ),
  );
}

function parseMeta(raw: string, folder: string): MetaFile {
  const meta = YAML.parse(raw);
  if (!meta || !Array.isArray(meta.items))
    throw new Error(`${folder}/_meta.yaml 缺少 items 数组`);
  return meta as MetaFile;
}

function validUrl(value: string | undefined) {
  if (!value || value === "TODO") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

async function readCategory(libraryDir: string, folder: string) {
  const config = getCategoryByFolder(folder);
  if (!config) throw new Error(`未知分类目录: ${folder}`);

  const metaPath = join(libraryDir, folder, "_meta.yaml");
  if (!existsSync(metaPath))
    return { folder, order: 999, items: [] as GeneratedSvg[] };
  const meta = parseMeta(await readFile(metaPath, "utf8"), folder);
  const items = meta.items.map((item, index): GeneratedSvg => {
    if (!item?.title || !item.file)
      throw new Error(
        `${folder}/_meta.yaml 第 ${index + 1} 项缺少 title 或 file`,
      );
    const url = validUrl(item.url);
    return {
      title: item.title,
      category: config.dataName,
      route: routeValue(item.file, folder, `${folder}/${item.title} 主 Logo`),
      ...(item.wordmark
        ? {
            wordmark: routeValue(
              item.wordmark,
              folder,
              `${folder}/${item.title} Wordmark`,
            ),
          }
        : {}),
      ...(url ? { url } : {}),
      ...(item.addedAt ? { addedAt: item.addedAt } : {}),
    };
  });
  return { folder, order: meta.order ?? 999, items };
}

const literal = (value: string) => JSON.stringify(value);

function formatRoute(name: "route" | "wordmark", value: RouteValue) {
  if (typeof value === "string") return `    ${name}: ${literal(value)},`;
  return [
    `    ${name}: {`,
    `      dark: ${literal(value.dark)},`,
    `      light: ${literal(value.light)}`,
    "    },",
  ].join("\n");
}

function generateSvgs(svgs: GeneratedSvg[]) {
  const items = svgs.map((svg, index) =>
    [
      "  {",
      `    id: ${index + 1},`,
      `    title: ${literal(svg.title)},`,
      `    category: ${literal(svg.category)},`,
      formatRoute("route", svg.route),
      ...(svg.wordmark ? [formatRoute("wordmark", svg.wordmark)] : []),
      ...(svg.url ? [`    url: ${literal(svg.url)},`] : []),
      ...(svg.addedAt ? [`    addedAt: ${literal(svg.addedAt)},`] : []),
      "  }",
    ].join("\n"),
  );

  return `/**
 * [INPUT]: 依赖 src/server/library-index 从 static/library 元数据生成的 SVG 条目
 * [OUTPUT]: 对外提供 svgs 数组，作为站点 Logo 数据源
 * [POS]: data 的生成 SVG 索引，被 src/data/index.ts 包装后供首页与目录消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
// 自动生成，请勿手动编辑
// 由 src/server/library-index.ts 生成

import type { iSVG } from '../types/svg';

export const svgs: iSVG[] = [
${items.join(",\n")}
];
`;
}

function generateCategories(svgs: GeneratedSvg[]) {
  const counts = new Map<string, number>();
  for (const svg of svgs)
    counts.set(svg.category, (counts.get(svg.category) ?? 0) + 1);

  const entries = categoriesConfig
    .filter((category) => counts.has(category.dataName))
    .sort((a, b) => {
      if (a.folder === "other") return 1;
      if (b.folder === "other") return -1;
      return (counts.get(b.dataName) ?? 0) - (counts.get(a.dataName) ?? 0);
    })
    .map(
      (category) =>
        `  { name: ${literal(category.displayName)}, slug: ${literal(category.dataName)}, count: ${counts.get(category.dataName) ?? 0} }`,
    );

  return `/**
 * [INPUT]: 依赖 src/server/library-index 与 src/config/categories 的分类统计
 * [OUTPUT]: 对外提供 CategoryEntry 类型与 categories 分类计数数组
 * [POS]: data 的生成分类索引，被布局、侧边栏与分类导航消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
// 自动生成，请勿手动编辑
// 由 src/server/library-index.ts 生成

export interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}

export const categories: CategoryEntry[] = [
${entries.join(",\n")}
];
`;
}

export async function buildLibraryIndex(
  options: LibraryIndexOptions = {},
): Promise<LibraryIndexBuild> {
  const paths = resolveLibraryIndexPaths(options);
  const folders = await readdir(paths.libraryDir, { withFileTypes: true });
  const categories = await Promise.all(
    folders
      .filter((entry) => entry.isDirectory())
      .map((entry) => readCategory(paths.libraryDir, basename(entry.name))),
  );
  categories.sort((a, b) => a.order - b.order);
  const svgs = categories.flatMap((category) => category.items);
  return {
    ...paths,
    svgSource: generateSvgs(svgs),
    categoriesSource: generateCategories(svgs),
    count: svgs.length,
  };
}

async function readOptional(path: string) {
  return existsSync(path) ? readFile(path, "utf8") : undefined;
}

async function restore(path: string, content: string | undefined) {
  if (content === undefined) await rm(path, { force: true });
  else await writeFile(path, content, "utf8");
}

export async function writeLibraryIndex(options: LibraryIndexOptions = {}) {
  const build = await buildLibraryIndex(options);
  const [originalSvg, originalCategories] = await Promise.all([
    readOptional(build.svgOutput),
    readOptional(build.categoriesOutput),
  ]);
  const token = `${process.pid}-${Date.now()}`;
  const svgTemp = `${build.svgOutput}.${token}.tmp`;
  const categoriesTemp = `${build.categoriesOutput}.${token}.tmp`;
  let svgCommitted = false;

  try {
    await Promise.all([
      writeFile(svgTemp, build.svgSource, { encoding: "utf8", flag: "wx" }),
      writeFile(categoriesTemp, build.categoriesSource, {
        encoding: "utf8",
        flag: "wx",
      }),
    ]);
    await rename(svgTemp, build.svgOutput);
    svgCommitted = true;
    await rename(categoriesTemp, build.categoriesOutput);
    return build;
  } catch (error) {
    if (svgCommitted) await restore(build.svgOutput, originalSvg);
    await restore(build.categoriesOutput, originalCategories);
    throw error;
  } finally {
    await Promise.all([
      rm(svgTemp, { force: true }),
      rm(categoriesTemp, { force: true }),
    ]);
  }
}
