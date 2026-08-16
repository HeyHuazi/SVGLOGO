/*
 * [INPUT]: 依赖 Vitest、types/svg 与 components/download-assets 下载视图模型
 * [OUTPUT]: 验证 single/themed 主 Logo、Wordmark 的预览选择、文件名和下载条目展开
 * [POS]: components 的下载行为纯函数测试，阻止模板重新产生资源分支漂移
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, expect, it } from "vitest";
import type { iSVG } from "@/types/svg";
import { buildDownloadGroups } from "./download-assets";

const base = {
  title: "Brand",
  category: "企业组织" as const,
} satisfies Pick<iSVG, "title" | "category">;

describe("download asset groups", () => {
  it("展开单一主 Logo 和单一 Wordmark", () => {
    const groups = buildDownloadGroups(
      {
        ...base,
        route: "/Brand.svg",
        wordmark: "/Brand_wordmark.svg",
      },
      "light",
    );
    expect(groups).toMatchObject([
      {
        role: "logo",
        preview: "/Brand.svg",
        items: [{ theme: "single", filename: "Brand" }],
      },
      {
        role: "wordmark",
        preview: "/Brand_wordmark.svg",
        items: [{ theme: "single", filename: "Brand_wordmark" }],
      },
    ]);
  });

  it("展开主题资源并按当前主题选择预览", () => {
    const [group] = buildDownloadGroups(
      {
        ...base,
        route: { light: "/Brand_light.svg", dark: "/Brand_dark.svg" },
      },
      "dark",
    );
    expect(group.preview).toBe("/Brand_dark.svg");
    expect(group.items).toEqual([
      expect.objectContaining({ theme: "light", filename: "Brand_light" }),
      expect.objectContaining({ theme: "dark", filename: "Brand_dark" }),
    ]);
  });
});
