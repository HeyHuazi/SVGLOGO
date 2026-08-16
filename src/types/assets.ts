/*
 * [INPUT]: 依赖无；接收 YAML/生成索引使用的字符串或完整 light/dark 对象
 * [OUTPUT]: 对外提供 AssetVariant、StoredAssetFile 及规范化、序列化、映射、枚举和主题解析纯函数
 * [POS]: types 的品牌资源本体模型，统一 Admin、服务端编译器与前端消费对 single/themed 资产的理解
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export type AssetTheme = "light" | "dark";

export interface StoredThemeFile {
  light: string;
  dark: string;
}

export type StoredAssetFile = string | StoredThemeFile;

export type AssetVariant<T> =
  | { kind: "single"; file: T }
  | { kind: "themed"; light: T; dark: T };

export interface BrandResources<T> {
  primary: AssetVariant<T>;
  wordmark?: AssetVariant<T>;
}

export function isThemedVariant<T>(
  variant: AssetVariant<T>,
): variant is Extract<AssetVariant<T>, { kind: "themed" }> {
  return variant.kind === "themed";
}

export function parseStoredVariant(
  value: StoredAssetFile,
  context = "主题资源",
): AssetVariant<string> {
  if (typeof value === "string") {
    if (!value.trim()) throw new Error(`${context}文件名不能为空`);
    return { kind: "single", file: value };
  }

  const light = value?.light?.trim();
  const dark = value?.dark?.trim();
  if (!light || !dark) {
    throw new Error(`${context}必须同时提供 light 与 dark 文件`);
  }
  return { kind: "themed", light, dark };
}

export function serializeStoredVariant<T extends string>(
  variant: AssetVariant<T>,
): StoredAssetFile {
  return variant.kind === "single"
    ? variant.file
    : { light: variant.light, dark: variant.dark };
}

export function mapVariant<T, R>(
  variant: AssetVariant<T>,
  mapper: (value: T, theme: AssetTheme | "single") => R,
): AssetVariant<R> {
  return variant.kind === "single"
    ? { kind: "single", file: mapper(variant.file, "single") }
    : {
        kind: "themed",
        light: mapper(variant.light, "light"),
        dark: mapper(variant.dark, "dark"),
      };
}

export function listVariantValues<T>(variant: AssetVariant<T>): T[] {
  return variant.kind === "single"
    ? [variant.file]
    : [variant.light, variant.dark];
}

export function listStoredAssetFiles(
  value: StoredAssetFile | undefined,
  context = "主题资源",
): string[] {
  return value ? listVariantValues(parseStoredVariant(value, context)) : [];
}

export function resolveVariant<T>(
  variant: AssetVariant<T>,
  theme: AssetTheme,
): T {
  return variant.kind === "single" ? variant.file : variant[theme];
}

export function resolveStoredAsset(
  value: StoredAssetFile,
  theme: AssetTheme,
  context = "主题资源",
): string {
  return resolveVariant(parseStoredVariant(value, context), theme);
}
