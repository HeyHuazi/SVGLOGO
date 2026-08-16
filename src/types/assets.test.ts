/*
 * [INPUT]: 依赖 types/assets 的资产变体纯函数与 Vitest
 * [OUTPUT]: 验证 single/themed 解析、序列化、映射、枚举、主题选择与非法半套主题拒绝
 * [POS]: types 的资产领域契约测试，防止浏览器、服务端与生成器重新产生不同主题语义
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { describe, expect, it } from "vitest";
import {
  listStoredAssetFiles,
  mapVariant,
  parseStoredVariant,
  resolveStoredAsset,
  serializeStoredVariant,
} from "./assets";

describe("asset variants", () => {
  it("将旧字符串资源规范化为 single", () => {
    expect(parseStoredVariant("Brand.svg")).toEqual({
      kind: "single",
      file: "Brand.svg",
    });
    expect(resolveStoredAsset("Brand.svg", "dark")).toBe("Brand.svg");
  });

  it("将完整主题对象规范化并保持 light/dark 顺序", () => {
    const variant = parseStoredVariant({
      light: "Brand_light.svg",
      dark: "Brand_dark.svg",
    });
    expect(variant).toEqual({
      kind: "themed",
      light: "Brand_light.svg",
      dark: "Brand_dark.svg",
    });
    expect(serializeStoredVariant(variant)).toEqual({
      light: "Brand_light.svg",
      dark: "Brand_dark.svg",
    });
    expect(listStoredAssetFiles(serializeStoredVariant(variant))).toEqual([
      "Brand_light.svg",
      "Brand_dark.svg",
    ]);
  });

  it("映射时保留资源形态和主题语义", () => {
    expect(
      mapVariant(
        { kind: "themed", light: "light.svg", dark: "dark.svg" },
        (value, theme) => `${theme}:${value}`,
      ),
    ).toEqual({
      kind: "themed",
      light: "light:light.svg",
      dark: "dark:dark.svg",
    });
  });

  it("拒绝缺少任一变体的主题对象", () => {
    expect(() =>
      parseStoredVariant(
        { light: "Brand_light.svg" } as { light: string; dark: string },
        "测试品牌主 Logo",
      ),
    ).toThrow("测试品牌主 Logo必须同时提供 light 与 dark 文件");
  });
});
