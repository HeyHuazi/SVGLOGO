/*
 * [INPUT]: 依赖 Vitest、浏览器 File、types/assets 变体契约与 draft-rules 纯函数
 * [OUTPUT]: 验证 single/themed 自动配对、普通品牌匹配、批内/全库冲突、update 自身放行与 URL 门禁
 * [POS]: routes/admin/lib 的客户端规则测试，保护 Admin 与服务端共享完整主题和全资源唯一性语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, expect, it } from "vitest";
import type { AssetVariant } from "@/types/assets";
import type { Draft, ExistingAsset, SvgResource } from "../types";
import {
  cleanTitle,
  findExistingAssetByPrimaryFilename,
  pairSvgFiles,
  safeFilename,
  validateDrafts,
} from "./draft-rules";

const svg = '<svg viewBox="0 0 10 10"></svg>';
const file = (name: string, type = "image/svg+xml") =>
  new File([svg], name, { type });
const resource = (filename: string): SvgResource => ({
  file: file(filename),
  preview: `blob:${filename}`,
  filename,
});
const single = (filename: string): AssetVariant<SvgResource> => ({
  kind: "single",
  file: resource(filename),
});
const themed = (light: string, dark: string): AssetVariant<SvgResource> => ({
  kind: "themed",
  light: resource(light),
  dark: resource(dark),
});
const draft = (patch: Partial<Draft> = {}): Draft => ({
  id: patch.id ?? crypto.randomUUID(),
  primary: patch.primary ?? single("Brand.svg"),
  operation: patch.operation ?? "add",
  title: patch.title ?? "Brand",
  category: patch.category ?? "company",
  url: patch.url ?? "",
  contributor: patch.contributor ?? "",
  ...(patch.target ? { target: patch.target } : {}),
  ...(patch.wordmark ? { wordmark: patch.wordmark } : {}),
});

describe("admin draft rules", () => {
  it("pairs Brand.svg with Brand_wordmark.svg", () => {
    expect(
      pairSvgFiles([file("Brand.svg"), file("Brand_wordmark.svg")]),
    ).toEqual([
      expect.objectContaining({
        key: "brand",
        primary: {
          kind: "single",
          file: expect.objectContaining({ name: "Brand.svg" }),
        },
        wordmark: {
          kind: "single",
          file: expect.objectContaining({ name: "Brand_wordmark.svg" }),
        },
      }),
    ]);
  });

  it("pairs complete light/dark logo and wordmark variants", () => {
    const [pair] = pairSvgFiles([
      file("Brand_light.svg"),
      file("Brand_dark.svg"),
      file("Brand_wordmark_light.svg"),
      file("Brand_wordmark_dark.svg"),
    ]);
    expect(pair.primary).toMatchObject({
      kind: "themed",
      light: { name: "Brand_light.svg" },
      dark: { name: "Brand_dark.svg" },
    });
    expect(pair.wordmark).toMatchObject({
      kind: "themed",
      light: { name: "Brand_wordmark_light.svg" },
      dark: { name: "Brand_wordmark_dark.svg" },
    });
  });

  it("rejects incomplete themed pairs", () => {
    expect(() => pairSvgFiles([file("Brand_light.svg")])).toThrow(
      "brand 主 Logo必须同时提供 light 与 dark 文件",
    );
  });

  it("matches only ordinary primary assets by normalized filename", () => {
    const ordinary: ExistingAsset = {
      title: "ＡＣＭＥ",
      category: "company",
      file: "Acme.svg",
    };
    const themedAsset: ExistingAsset = {
      title: "主题品牌",
      category: "tools",
      file: { light: "ThemeLight.svg", dark: "ThemeDark.svg" },
    };
    expect(
      findExistingAssetByPrimaryFilename(
        [ordinary, themedAsset],
        " ａｃｍｅ.SVG ",
      ),
    ).toBe(ordinary);
    expect(
      findExistingAssetByPrimaryFilename(
        [ordinary, themedAsset],
        "ThemeDark.svg",
      ),
    ).toBeUndefined();
  });

  it("keeps wordmark-only files for draft-state fallback", () => {
    expect(pairSvgFiles([file("Only_wordmark.svg")])).toEqual([
      expect.objectContaining({
        key: "only",
        wordmark: {
          kind: "single",
          file: expect.objectContaining({ name: "Only_wordmark.svg" }),
        },
      }),
    ]);
  });

  it("derives safe filenames and titles", () => {
    expect(safeFilename("../奇怪 Logo!.svg")).toBe("..奇怪Logo.svg");
    expect(cleanTitle("Acme_wordmark_dark.svg")).toBe("Acme");
  });

  it("reports batch duplicate filenames and display names", () => {
    const errors = validateDrafts(
      [
        draft({ id: "1", title: "重复", primary: single("Same.svg") }),
        draft({ id: "2", title: " 重复 ", primary: single("same.svg") }),
      ],
      [],
    );
    expect(errors[0]).toEqual(
      expect.arrayContaining([
        "批次内文件名重复：Same.svg",
        "批次内展示名称重复：重复",
      ]),
    );
    expect(errors[1]).toEqual(
      expect.arrayContaining([
        "批次内文件名重复：same.svg",
        "批次内展示名称重复：重复",
      ]),
    );
  });

  it("checks existing titles and all themed filenames", () => {
    const existing: ExistingAsset[] = [
      { title: "已有品牌", category: "company", file: "Existing.svg" },
      {
        title: "主题品牌",
        category: "tools",
        file: { light: "SharedLight.svg", dark: "Shared.svg" },
        wordmark: {
          light: "Shared_wordmark_light.svg",
          dark: "Shared_wordmark.svg",
        },
      },
    ];
    const [errors] = validateDrafts(
      [draft({ title: "已有品牌", primary: single("shared.svg") })],
      existing,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        "展示名称已存在：已有品牌（company）",
        "主 Logo文件名已被使用：shared.svg → 主题品牌（tools）",
      ]),
    );
  });

  it("allows update drafts to keep their own files", () => {
    const existing: ExistingAsset[] = [
      {
        title: "Brand",
        category: "company",
        file: "Brand.svg",
        wordmark: "Brand_wordmark.svg",
      },
    ];
    expect(
      validateDrafts(
        [
          draft({
            operation: "update",
            target: { category: "company", primary: "Brand.svg" },
            wordmark: single("Brand_wordmark.svg"),
          }),
        ],
        existing,
      )[0],
    ).toEqual([]);
  });

  it("rejects same primary/wordmark filenames and invalid URLs", () => {
    const [errors] = validateDrafts(
      [draft({ wordmark: single("Brand.svg"), url: "ftp://example.com" })],
      [],
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        "主 Logo 与 Wordmark 文件名相同",
        "官网地址无效",
      ]),
    );
  });

  it("detects duplicate names across themed slots", () => {
    const [errors] = validateDrafts(
      [
        draft({
          primary: themed("Brand.svg", "Brand_dark.svg"),
          wordmark: single("brand.svg"),
        }),
      ],
      [],
    );
    expect(errors).toContain("主 Logo 与 Wordmark 文件名相同");
  });
});
