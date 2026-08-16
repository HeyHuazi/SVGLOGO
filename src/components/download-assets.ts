/*
 * [INPUT]: 依赖 types/assets 的资源规范与 types/svg 的 iSVG 品牌数据
 * [OUTPUT]: 对外提供 DownloadableAsset、buildDownloadGroups 与当前主题预览解析
 * [POS]: components 的下载视图模型，把品牌资源矩阵折叠为可遍历数据，消除 Svelte 模板分支扩散
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  parseStoredVariant,
  resolveVariant,
  type AssetTheme,
  type AssetVariant,
} from "@/types/assets";
import type { iSVG } from "@/types/svg";

export type DownloadRole = "logo" | "wordmark";
export type DownloadTheme = "single" | AssetTheme;

export interface DownloadableAsset {
  role: DownloadRole;
  theme: DownloadTheme;
  url: string;
  filename: string;
  label: string;
}

export interface DownloadGroup {
  role: DownloadRole;
  label: string;
  preview: string;
  variant: AssetVariant<string>;
  items: DownloadableAsset[];
}

function group(
  svg: iSVG,
  role: DownloadRole,
  theme: AssetTheme,
): DownloadGroup | undefined {
  const stored = role === "logo" ? svg.route : svg.wordmark;
  if (!stored) return undefined;
  const variant = parseStoredVariant(
    stored,
    `${svg.title}${role === "wordmark" ? " Wordmark" : " 主 Logo"}`,
  );
  const prefix = role === "wordmark" ? `${svg.title}_wordmark` : svg.title;
  const items: DownloadableAsset[] =
    variant.kind === "single"
      ? [
          {
            role,
            theme: "single",
            url: variant.file,
            filename: prefix,
            label: "单一版本",
          },
        ]
      : [
          {
            role,
            theme: "light",
            url: variant.light,
            filename: `${prefix}_light`,
            label: "亮色界面版本",
          },
          {
            role,
            theme: "dark",
            url: variant.dark,
            filename: `${prefix}_dark`,
            label: "暗色界面版本",
          },
        ];
  return {
    role,
    label: role === "logo" ? "标识" : "组合标志",
    preview: resolveVariant(variant, theme),
    variant,
    items,
  };
}

export function buildDownloadGroups(svg: iSVG, theme: AssetTheme) {
  return [group(svg, "logo", theme), group(svg, "wordmark", theme)].filter(
    (item): item is DownloadGroup => Boolean(item),
  );
}
