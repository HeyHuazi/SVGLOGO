/*
 * [INPUT]: 依赖 SvelteKit multipart RequestHandler、dev 环境保护、共享 SVG 上限、types/assets 变体契约与 admin/lib 品牌事务
 * [OUTPUT]: 对外提供 POST /admin/api/upload，接收 single/themed 主 Logo 加可选 Wordmark 的完整品牌草稿
 * [POS]: routes/admin/api 的 multipart 适配器，只验证资源槽位协议并组装聚合，不重复 SVG 内容校验和写盘规则
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { AssetVariant, StoredAssetFile } from "@/types/assets";
import { SVG_SIZE_LIMIT_BYTES } from "@/config/svg";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { assertAdminRequest } from "../../lib/guard";

interface SingleResourceMeta {
  kind: "single";
  filename: string;
}

interface ThemedResourceMeta {
  kind: "themed";
  lightFilename: string;
  darkFilename: string;
}

type ResourceMeta = SingleResourceMeta | ThemedResourceMeta;

interface DraftMeta {
  id: string;
  operation: "add" | "update";
  target?: { category: string; primary: StoredAssetFile };
  title: string;
  primary: ResourceMeta;
  wordmark?: ResourceMeta;
  category: string;
  url?: string;
  contributor?: string;
}

function parseDrafts(form: FormData): DraftMeta[] {
  const raw = form.get("drafts");
  if (typeof raw !== "string") throw new Error("缺少上传草稿");
  const drafts = JSON.parse(raw);
  if (!Array.isArray(drafts) || !drafts.length)
    throw new Error("请选择至少一个品牌资产");
  return drafts;
}

function requireSvg(files: Map<string, File>, key: string, label: string) {
  const file = files.get(key);
  if (!file) throw new Error(`${label}: 缺少 SVG 文件`);
  if (file.size > SVG_SIZE_LIMIT_BYTES)
    throw new Error(`${file.name}: SVG 文件超过 200KB`);
  return file;
}

async function parseResource(
  files: Map<string, File>,
  draftId: string,
  role: "primary" | "wordmark",
  meta: ResourceMeta,
  label: string,
): Promise<AssetVariant<{ svg: string; filename: string }>> {
  if (!meta || (meta.kind !== "single" && meta.kind !== "themed")) {
    throw new Error(`${label}: 资源类型无效`);
  }
  if (meta.kind === "single") {
    const file = requireSvg(files, `${role}:single:${draftId}`, label);
    return {
      kind: "single",
      file: {
        svg: await file.text(),
        filename: String(meta.filename ?? "").trim(),
      },
    };
  }
  const light = requireSvg(
    files,
    `${role}:light:${draftId}`,
    `${label}（亮色界面）`,
  );
  const dark = requireSvg(
    files,
    `${role}:dark:${draftId}`,
    `${label}（暗色界面）`,
  );
  return {
    kind: "themed",
    light: {
      svg: await light.text(),
      filename: String(meta.lightFilename ?? "").trim(),
    },
    dark: {
      svg: await dark.text(),
      filename: String(meta.darkFilename ?? "").trim(),
    },
  };
}

export const POST: RequestHandler = async ({ request }) => {
  assertAdminRequest(request, true);

  try {
    const form = await request.formData();
    const drafts = parseDrafts(form);
    const files = new Map<string, File>();
    for (const [key, value] of form.entries())
      if (value instanceof File) files.set(key, value);

    const inputs = await Promise.all(
      drafts.map(async (draft) => {
        if (draft.operation !== "add" && draft.operation !== "update")
          throw new Error("操作类型无效");
        if (draft.operation === "update" && !draft.target)
          throw new Error("更新草稿缺少既有品牌目标");
        const title = String(draft.title ?? "").trim();
        const primary = await parseResource(
          files,
          draft.id,
          "primary",
          draft.primary,
          title || "草稿主 Logo",
        );
        const wordmark = draft.wordmark
          ? await parseResource(
              files,
              draft.id,
              "wordmark",
              draft.wordmark,
              `${title || "草稿"} Wordmark`,
            )
          : undefined;
        return {
          operation: draft.operation,
          ...(draft.target ? { target: draft.target } : {}),
          primary,
          ...(wordmark ? { wordmark } : {}),
          title,
          category: String(draft.category ?? "").trim(),
          url: String(draft.url ?? "").trim(),
          contributor: String(draft.contributor ?? "").trim(),
        };
      }),
    );

    const { ingestSvgAssets } = await import("../../lib/library");
    const result = await ingestSvgAssets(inputs);
    return json({ ok: true, ...result });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "上传失败";
    return json({ ok: false, error: message }, { status: 400 });
  }
};
