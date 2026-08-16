/*
 * [INPUT]: 依赖浏览器 fetch/FormData、types/assets 变体枚举与 routes/admin/types 草稿/release 契约
 * [OUTPUT]: 对外提供上传变体品牌草稿、保存 release 草稿、执行 release 动作与发布更新日志的 HTTP 适配函数
 * [POS]: routes/admin/lib 的客户端 API 边界，集中维护 multipart 资源槽位协议，页面不感知传输细节
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import type { AssetVariant } from "@/types/assets";
import type { Draft, ReleaseState, SvgResource } from "../types";

export interface UploadResult {
  ok: true;
  count: number;
  fileCount: number;
  items: ReleaseState["active"]["items"];
}

type ReleaseAction = "remove-item" | "clear" | "publish";
type ResourceRole = "primary" | "wordmark";

async function jsonResult<T>(response: Response, fallback: string): Promise<T> {
  const result = await response.json();
  if (!response.ok || result.ok === false)
    throw new Error(result.error || fallback);
  return result as T;
}

function resourceMeta(variant: AssetVariant<SvgResource>) {
  return variant.kind === "single"
    ? { kind: "single" as const, filename: variant.file.filename }
    : {
        kind: "themed" as const,
        lightFilename: variant.light.filename,
        darkFilename: variant.dark.filename,
      };
}

function appendVariantFiles(
  form: FormData,
  draftId: string,
  role: ResourceRole,
  variant: AssetVariant<SvgResource>,
) {
  if (variant.kind === "single") {
    form.set(
      `${role}:single:${draftId}`,
      variant.file.file,
      variant.file.file.name,
    );
    return;
  }
  form.set(
    `${role}:light:${draftId}`,
    variant.light.file,
    variant.light.file.name,
  );
  form.set(
    `${role}:dark:${draftId}`,
    variant.dark.file,
    variant.dark.file.name,
  );
}

export async function uploadDrafts(drafts: Draft[]): Promise<UploadResult> {
  const form = new FormData();
  form.set(
    "drafts",
    JSON.stringify(
      drafts.map(
        ({
          id,
          operation,
          target,
          title,
          primary,
          wordmark,
          category,
          url,
          contributor,
        }) => ({
          id,
          operation,
          ...(target ? { target } : {}),
          title,
          primary: resourceMeta(primary),
          ...(wordmark ? { wordmark: resourceMeta(wordmark) } : {}),
          category,
          url,
          contributor,
        }),
      ),
    ),
  );

  drafts.forEach((draft) => {
    appendVariantFiles(form, draft.id, "primary", draft.primary);
    if (draft.wordmark) {
      appendVariantFiles(form, draft.id, "wordmark", draft.wordmark);
    }
  });

  return jsonResult<UploadResult>(
    await fetch("/admin/api/upload", { method: "POST", body: form }),
    "批量入库失败",
  );
}

export async function saveReleaseDraft(active: ReleaseState["active"]) {
  return jsonResult<ReleaseState>(
    await fetch("/admin/api/batch", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    }),
    "保存批次失败",
  );
}

export async function runReleaseAction(
  action: Exclude<ReleaseAction, "publish">,
  id?: string,
) {
  const result = await jsonResult<{ ok: true; state: ReleaseState }>(
    await fetch("/admin/api/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...(id ? { id } : {}) }),
    }),
    "更新记录操作失败",
  );
  return result.state;
}

export async function publishReleaseBatch() {
  const result = await jsonResult<{ ok: true; state: ReleaseState }>(
    await fetch("/admin/api/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    }),
    "发布失败",
  );
  return result.state;
}
