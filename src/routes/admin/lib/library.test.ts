/*
 * [INPUT]: 依赖 vitest、临时多分类目录、共享索引编译器与 admin/lib 品牌资产事务
 * [OUTPUT]: 验证主 Logo/Wordmark 聚合、批量 add/update、单次索引生成、预检零写入与失败完整回滚
 * [POS]: routes/admin/lib 集成测试，保护品牌条目、全部关联 SVG、YAML、生成索引和发布草稿的原子一致性
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as YAML from "yaml";
import { getExistingAssets, ingestSvgAsset, ingestSvgAssets } from "./library";

let root = "";
let companyDir = "";
let toolsDir = "";
let releasePath = "";
let svgOutput = "";
let categoriesOutput = "";

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "svglogo-library-"));
  companyDir = join(root, "company");
  toolsDir = join(root, "tools");
  releasePath = join(root, "release-draft.json");
  svgOutput = join(root, "svgs.ts");
  categoriesOutput = join(root, "categories.ts");
  await Promise.all([mkdir(companyDir), mkdir(toolsDir)]);
  await writeFile(join(companyDir, "_meta.yaml"), "order: 1\nitems: []\n");
  await writeFile(join(toolsDir, "_meta.yaml"), "order: 2\nitems: []\n");
  await writeFile(
    releasePath,
    JSON.stringify({
      schemaVersion: 1,
      active: { version: "", date: "", summary: "", items: [] },
      publishing: null,
    }),
  );
  await writeFile(svgOutput, "original svg index");
  await writeFile(categoriesOutput, "original category index");
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

const validSvg =
  '<svg viewBox="0 0 100 50"><rect width="100" height="50"/></svg>';
const wordmarkSvg =
  '<svg viewBox="0 0 200 50"><path d="M0 0h200v50H0z"/></svg>';
const asset = (filename: string, svg = validSvg) => ({ filename, svg });
const options = () => ({
  libraryDir: root,
  releasePath,
  svgOutput,
  categoriesOutput,
});

describe("admin library brand asset ingest", () => {
  it("writes multiple brand assets and generates the index once", async () => {
    const generateIndex = vi.fn(async () => undefined);
    const result = await ingestSvgAssets(
      [
        {
          operation: "add",
          primary: asset("Example.svg"),
          wordmark: asset("Example_wordmark.svg", wordmarkSvg),
          category: "company",
          title: "示例品牌",
          contributor: "@投稿人",
        },
        {
          operation: "add",
          primary: asset("Tool.svg"),
          category: "tools",
          title: "示例工具",
        },
      ],
      { ...options(), generateIndex },
    );

    expect(result).toMatchObject({ count: 2, fileCount: 3 });
    expect(generateIndex).toHaveBeenCalledTimes(1);
    expect(await readFile(join(companyDir, "Example.svg"), "utf8")).toContain(
      'height="46"',
    );
    expect(
      await readFile(join(companyDir, "Example_wordmark.svg"), "utf8"),
    ).toContain('height="46"');
    expect(
      YAML.parse(await readFile(join(companyDir, "_meta.yaml"), "utf8"))
        .items[0],
    ).toMatchObject({
      title: "示例品牌",
      file: "Example.svg",
      wordmark: "Example_wordmark.svg",
      submitter: "@投稿人",
    });
    expect(
      JSON.parse(await readFile(releasePath, "utf8")).active.items,
    ).toHaveLength(2);
  });

  it("writes complete themed logo and wordmark pairs as one brand", async () => {
    const result = await ingestSvgAsset(
      {
        operation: "add",
        primary: {
          kind: "themed",
          light: asset("Theme_light.svg"),
          dark: asset("Theme_dark.svg"),
        },
        wordmark: {
          kind: "themed",
          light: asset("Theme_wordmark_light.svg", wordmarkSvg),
          dark: asset("Theme_wordmark_dark.svg", wordmarkSvg),
        },
        category: "company",
        title: "主题品牌",
      },
      options(),
    );

    expect(result.path).toContain("Theme_light.svg");
    expect(await readdir(companyDir)).toEqual(
      expect.arrayContaining([
        "Theme_light.svg",
        "Theme_dark.svg",
        "Theme_wordmark_light.svg",
        "Theme_wordmark_dark.svg",
      ]),
    );
    expect(
      YAML.parse(await readFile(join(companyDir, "_meta.yaml"), "utf8"))
        .items[0],
    ).toMatchObject({
      file: { light: "Theme_light.svg", dark: "Theme_dark.svg" },
      wordmark: {
        light: "Theme_wordmark_light.svg",
        dark: "Theme_wordmark_dark.svg",
      },
    });
  });

  it("rejects implicit single to themed shape changes during update", async () => {
    await ingestSvgAsset(
      {
        operation: "add",
        primary: asset("Example.svg"),
        category: "company",
        title: "示例品牌",
      },
      options(),
    );

    await expect(
      ingestSvgAsset(
        {
          operation: "update",
          target: { category: "company", primary: "Example.svg" },
          primary: {
            kind: "themed",
            light: asset("Example_light.svg"),
            dark: asset("Example_dark.svg"),
          },
          category: "company",
          title: "示例品牌",
        },
        options(),
      ),
    ).rejects.toThrow("必须沿用现有资源形态和文件名");
  });

  it("keeps the existing wordmark submitter and addedAt while updating only the primary logo", async () => {
    await ingestSvgAsset(
      {
        operation: "add",
        primary: asset("Example.svg"),
        wordmark: asset("Example_wordmark.svg", wordmarkSvg),
        category: "company",
        title: "示例品牌",
        contributor: "@原投稿人",
      },
      options(),
    );
    const before = YAML.parse(
      await readFile(join(companyDir, "_meta.yaml"), "utf8"),
    ).items[0];

    await ingestSvgAsset(
      {
        operation: "update",
        primary: asset(
          "Example.svg",
          '<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"/></svg>',
        ),
        category: "company",
        title: "示例品牌新版",
        contributor: "@维护者",
      },
      options(),
    );

    const after = YAML.parse(
      await readFile(join(companyDir, "_meta.yaml"), "utf8"),
    ).items[0];
    expect(after).toMatchObject({
      title: "示例品牌新版",
      file: "Example.svg",
      wordmark: "Example_wordmark.svg",
      submitter: "@原投稿人",
      addedAt: before.addedAt,
    });
    expect(
      await readFile(join(companyDir, "Example_wordmark.svg"), "utf8"),
    ).toContain('height="46"');
  });

  it("updates an existing wordmark together with the primary logo", async () => {
    await ingestSvgAsset(
      {
        operation: "add",
        primary: asset("Example.svg"),
        wordmark: asset("Example_wordmark.svg", wordmarkSvg),
        category: "company",
        title: "示例品牌",
      },
      options(),
    );

    await ingestSvgAsset(
      {
        operation: "update",
        primary: asset(
          "Example.svg",
          '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="25"/></svg>',
        ),
        wordmark: asset(
          "Example_wordmark.svg",
          '<svg viewBox="0 0 300 60"><rect width="300" height="60"/></svg>',
        ),
        category: "company",
        title: "示例品牌",
      },
      options(),
    );

    expect(
      await readFile(join(companyDir, "Example_wordmark.svg"), "utf8"),
    ).toContain('viewBox="0 0 300 60"');
    expect(
      YAML.parse(await readFile(join(companyDir, "_meta.yaml"), "utf8"))
        .items[0].wordmark,
    ).toBe("Example_wordmark.svg");
  });

  it("lists wordmark and themed assets without flattening the metadata contract", async () => {
    await writeFile(
      join(companyDir, "_meta.yaml"),
      YAML.stringify({
        order: 1,
        items: [
          {
            title: "组合品牌",
            file: "Brand.svg",
            wordmark: "Brand_wordmark.svg",
          },
          {
            title: "主题品牌",
            file: { dark: "Dark.svg", light: "Light.svg" },
            wordmark: {
              dark: "Dark_wordmark.svg",
              light: "Light_wordmark.svg",
            },
          },
        ],
      }),
    );

    expect(await getExistingAssets(root)).toEqual([
      {
        title: "主题品牌",
        file: { dark: "Dark.svg", light: "Light.svg" },
        wordmark: { dark: "Dark_wordmark.svg", light: "Light_wordmark.svg" },
        category: "company",
      },
      {
        title: "组合品牌",
        file: "Brand.svg",
        wordmark: "Brand_wordmark.svg",
        category: "company",
      },
    ]);
  });

  it("rejects duplicate display names across categories before writing", async () => {
    await writeFile(join(companyDir, "Existing.svg"), validSvg);
    await writeFile(
      join(companyDir, "_meta.yaml"),
      YAML.stringify({
        order: 1,
        items: [{ title: "重复品牌", file: "Existing.svg" }],
      }),
    );

    await expect(
      ingestSvgAsset(
        {
          operation: "add",
          primary: asset("New.svg"),
          category: "tools",
          title: " 重复品牌 ",
        },
        options(),
      ),
    ).rejects.toThrow("展示名称已存在");

    expect(await readdir(toolsDir)).toEqual(["_meta.yaml"]);
    expect(
      JSON.parse(await readFile(releasePath, "utf8")).active.items,
    ).toEqual([]);
  });

  it("rejects filenames already used by themed resources across categories", async () => {
    await writeFile(
      join(companyDir, "_meta.yaml"),
      YAML.stringify({
        order: 1,
        items: [
          {
            title: "主题品牌",
            file: { dark: "Shared.svg", light: "Light.svg" },
            wordmark: {
              dark: "Shared_wordmark.svg",
              light: "Light_wordmark.svg",
            },
          },
        ],
      }),
    );

    await expect(
      ingestSvgAsset(
        {
          operation: "add",
          primary: asset("shared.svg"),
          category: "tools",
          title: "新工具",
        },
        options(),
      ),
    ).rejects.toThrow("文件名 shared.svg 已被 主题品牌（company）使用");

    expect(await readdir(toolsDir)).toEqual(["_meta.yaml"]);
  });

  it("allows an update to keep its own display name and filenames", async () => {
    await ingestSvgAsset(
      {
        operation: "add",
        primary: asset("Example.svg"),
        wordmark: asset("Example_wordmark.svg", wordmarkSvg),
        category: "company",
        title: "示例品牌",
      },
      options(),
    );

    await expect(
      ingestSvgAsset(
        {
          operation: "update",
          primary: asset(
            "Example.svg",
            '<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="20"/></svg>',
          ),
          wordmark: asset("Example_wordmark.svg", wordmarkSvg),
          category: "company",
          title: "示例品牌",
        },
        options(),
      ),
    ).resolves.toBeDefined();
  });

  it("rejects duplicate files inside the batch before any write", async () => {
    await expect(
      ingestSvgAssets(
        [
          {
            operation: "add",
            primary: asset("Same.svg"),
            category: "company",
            title: "品牌一",
          },
          {
            operation: "add",
            primary: asset("Other.svg"),
            wordmark: asset("Same.svg"),
            category: "company",
            title: "品牌二",
          },
        ],
        options(),
      ),
    ).rejects.toThrow("批次内文件重复");

    expect(await readdir(companyDir)).toEqual(["_meta.yaml"]);
    expect(
      JSON.parse(await readFile(releasePath, "utf8")).active.items,
    ).toEqual([]);
  });

  it("rejects an invalid wordmark before writing valid siblings", async () => {
    await expect(
      ingestSvgAssets(
        [
          {
            operation: "add",
            primary: asset("Good.svg"),
            category: "company",
            title: "正常品牌",
          },
          {
            operation: "add",
            primary: asset("Tool.svg"),
            wordmark: asset(
              "Tool_wordmark.svg",
              "<svg><script>alert(1)</script></svg>",
            ),
            category: "tools",
            title: "危险品牌",
          },
        ],
        options(),
      ),
    ).rejects.toThrow();

    expect(await readdir(companyDir)).toEqual(["_meta.yaml"]);
    expect(await readdir(toolsDir)).toEqual(["_meta.yaml"]);
    expect(
      JSON.parse(await readFile(releasePath, "utf8")).active.items,
    ).toEqual([]);
  });

  it("rolls back primary wordmark draft and generated indexes when generation fails", async () => {
    await expect(
      ingestSvgAssets(
        [
          {
            operation: "add",
            primary: asset("Example.svg"),
            wordmark: asset("Example_wordmark.svg", wordmarkSvg),
            category: "company",
            title: "示例品牌",
          },
          {
            operation: "add",
            primary: asset("Tool.svg"),
            category: "tools",
            title: "示例工具",
          },
        ],
        {
          ...options(),
          generateIndex: async () => {
            await writeFile(svgOutput, "partial svg index");
            await writeFile(categoriesOutput, "partial category index");
            throw new Error("generation failed");
          },
        },
      ),
    ).rejects.toThrow("generation failed");

    expect(await readdir(companyDir)).toEqual(["_meta.yaml"]);
    expect(await readdir(toolsDir)).toEqual(["_meta.yaml"]);
    expect(
      YAML.parse(await readFile(join(companyDir, "_meta.yaml"), "utf8")).items,
    ).toEqual([]);
    expect(
      JSON.parse(await readFile(releasePath, "utf8")).active.items,
    ).toEqual([]);
    expect(await readFile(svgOutput, "utf8")).toBe("original svg index");
    expect(await readFile(categoriesOutput, "utf8")).toBe(
      "original category index",
    );
  });
});
