/*
 * [INPUT]: 依赖 Vitest、浏览器 File/ObjectURL stub、types/assets 变体与 draft-state 生命周期函数
 * [OUTPUT]: 验证普通品牌自动 update、主题草稿、重复目标替换、元数据继承与全部预览释放
 * [POS]: routes/admin/lib 的客户端状态测试，保护维护入口的品牌聚合和显式更新目标
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AssetVariant } from "@/types/assets";
import type { ExistingAsset } from "../types";
import {
  addFilesToDrafts,
  createUpdateDraft,
  upsertUpdateDraft,
} from "./draft-state";

const svg = '<svg viewBox="0 0 10 10"></svg>';
const file = (name: string) => new File([svg], name, { type: "image/svg+xml" });
const single = (name: string): AssetVariant<File> => ({
  kind: "single",
  file: file(name),
});
const themed = (light: string, dark: string): AssetVariant<File> => ({
  kind: "themed",
  light: file(light),
  dark: file(dark),
});
const defaults = { category: "tools", contributor: "@new" };
const existing: ExistingAsset = {
  title: "示例品牌",
  category: "company",
  file: "Brand.svg",
  wordmark: "Brand_wordmark.svg",
  url: "https://example.com/",
  contributor: "@original",
};

beforeEach(() => {
  let preview = 0;
  vi.stubGlobal("crypto", { randomUUID: () => `draft-${++preview}` });
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => `blob:${++preview}`),
    revokeObjectURL: vi.fn(),
  });
});

describe("admin draft state", () => {
  it("creates update drafts with canonical filename and explicit target", () => {
    expect(createUpdateDraft(single("brand.svg"), existing)).toMatchObject({
      operation: "update",
      target: { category: "company", primary: "Brand.svg" },
      title: "示例品牌",
      category: "company",
      url: "https://example.com/",
      contributor: "@original",
      primary: { kind: "single", file: { filename: "Brand.svg" } },
    });
  });

  it("auto-detects ordinary assets and keeps new files as add", () => {
    const drafts = addFilesToDrafts(
      [],
      [file("brand.svg"), file("New.svg")],
      defaults,
      [existing],
    );
    expect(drafts).toHaveLength(2);
    expect(drafts[0]).toMatchObject({
      operation: "update",
      title: "示例品牌",
      primary: { kind: "single", file: { filename: "Brand.svg" } },
    });
    expect(drafts[1]).toMatchObject({
      operation: "add",
      title: "New",
      category: "tools",
    });
  });

  it("keeps paired wordmark for an ordinary update", () => {
    const [draft] = addFilesToDrafts(
      [],
      [file("Brand.svg"), file("Brand_wordmark.svg")],
      defaults,
      [existing],
    );
    expect(draft).toMatchObject({
      operation: "update",
      primary: { kind: "single", file: { filename: "Brand.svg" } },
      wordmark: { kind: "single", file: { filename: "Brand_wordmark.svg" } },
    });
  });

  it("creates complete themed add drafts from strict filename pairs", () => {
    const [draft] = addFilesToDrafts(
      [],
      [file("Theme_light.svg"), file("Theme_dark.svg")],
      defaults,
    );
    expect(draft).toMatchObject({
      operation: "add",
      title: "Theme",
      primary: {
        kind: "themed",
        light: { filename: "Theme_light.svg" },
        dark: { filename: "Theme_dark.svg" },
      },
    });
  });

  it("replaces the same update target and revokes the old preview", () => {
    const first = upsertUpdateDraft([], single("first.svg"), existing);
    const primary = first[0].primary;
    if (primary.kind !== "single") throw new Error("expected single");
    const previousPreview = primary.file.preview;
    const next = upsertUpdateDraft(first, single("second.svg"), existing);
    expect(next).toHaveLength(1);
    expect(next[0].primary).toMatchObject({
      kind: "single",
      file: { filename: "Brand.svg", file: { name: "second.svg" } },
    });
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(previousPreview);
  });

  it("updates existing themed assets with canonical filenames", () => {
    const asset: ExistingAsset = {
      title: "主题品牌",
      category: "tools",
      file: { light: "Theme_light.svg", dark: "Theme_dark.svg" },
    };
    expect(
      createUpdateDraft(themed("new_light.svg", "new_dark.svg"), asset),
    ).toMatchObject({
      operation: "update",
      primary: {
        kind: "themed",
        light: { filename: "Theme_light.svg" },
        dark: { filename: "Theme_dark.svg" },
      },
    });
  });

  it("rejects changing update resource shape implicitly", () => {
    expect(() =>
      createUpdateDraft(themed("Brand_light.svg", "Brand_dark.svg"), existing),
    ).toThrow("更新资源形态与既有品牌不一致");
  });
});
