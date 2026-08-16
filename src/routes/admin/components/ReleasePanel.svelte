<!--
  [INPUT]: 依赖本地 release state、父页面保存/发布/移出/清空回调与 @/ui/dialog，使用 lucide-svelte 表达日志和危险操作状态
  [OUTPUT]: 对外提供可恢复更新日志草稿面板，校验发布元信息、显示未保存状态并以可访问 Dialog 确认仅影响 changelog 的移出与清空操作
  [POS]: routes/admin/components 的发布决策界面；编辑 active 草稿并请求父页面持久化，不直接操作文件系统
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import {
    AlertTriangle,
    CheckCircle2,
    ListRestart,
    PackageCheck,
    Rocket,
    Save,
    Trash2,
  } from "lucide-svelte";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/ui/dialog";

  import type { ReleaseChange, ReleaseState } from "../types";

  interface Confirmation {
    action: "remove-item" | "clear";
    id?: string;
    title?: string;
  }

  export let release: ReleaseState;
  export let savingRelease: boolean;
  export let releaseDirty: boolean;
  export let publishing: boolean;
  export let releaseAction: string;
  export let saveReleaseDraft: () => void;
  export let publishRelease: () => void;
  export let runReleaseAction: (
    action: "remove-item" | "clear",
    id?: string,
  ) => void;

  let confirmation: Confirmation | null = null;
  let dialogOpen = false;

  const changeLabel: Record<ReleaseChange, string> = {
    add: "新增",
    update: "更新",
    remove: "移除",
  };

  function requestConfirmation(next: Confirmation) {
    confirmation = next;
    dialogOpen = true;
  }

  function releaseErrors(state: ReleaseState) {
    const errors: string[] = [];
    if (!/^\d+\.\d+\.\d+$/.test(state.active.version))
      errors.push("版本号必须是 x.y.z");
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(state.active.date))
      errors.push("日期必须是 YYYY.MM.DD");
    if (!state.active.summary.trim()) errors.push("请填写本次更新说明");
    if (!state.active.items.length) errors.push("本次更新没有条目");
    return errors;
  }

  function closeConfirmation() {
    if (dialogBusy) return;
    dialogOpen = false;
    confirmation = null;
  }

  function confirmAction() {
    const target = confirmation;
    dialogOpen = false;
    confirmation = null;
    if (target) runReleaseAction(target.action, target.id);
  }

  $: errors = releaseErrors(release);
  $: busy = savingRelease || publishing || Boolean(releaseAction);
  $: dialogBusy =
    confirmation?.action === "clear"
      ? releaseAction === "clear"
      : releaseAction === confirmation?.id;
</script>

<section
  class="admin-panel flex h-[32rem] flex-col"
  aria-labelledby="release-panel-title"
>
  <header
    class="flex flex-col gap-3 border-b border-neutral-100 p-5 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between"
  >
    <div>
      <div class="flex items-center gap-2">
        <PackageCheck size={18} class="text-neutral-400" />
        <h2 id="release-panel-title" class="text-base font-semibold">
          本次更新
        </h2>
      </div>
      <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        这是 changelog 发布草稿，不是资产库存；每个品牌只登记一条记录。
      </p>
    </div>
    <span class="admin-count">{release.active.items.length} 条</span>
  </header>

  <div
    class="grid gap-3 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:grid-cols-[140px_150px_1fr]"
  >
    <label class="admin-label"
      >版本号
      <input
        bind:value={release.active.version}
        placeholder="4.3.0"
        aria-invalid={!/^\d+\.\d+\.\d+$/.test(release.active.version)}
        class="admin-field"
      />
    </label>
    <label class="admin-label"
      >发布日期
      <input
        bind:value={release.active.date}
        placeholder="2026.07.19"
        aria-invalid={!/^\d{4}\.\d{2}\.\d{2}$/.test(release.active.date)}
        class="admin-field"
      />
    </label>
    <label class="admin-label"
      >更新说明
      <input
        bind:value={release.active.summary}
        placeholder="概括本批次品牌资产变化"
        aria-invalid={!release.active.summary.trim()}
        class="admin-field"
      />
    </label>
  </div>

  <div class="min-h-0 flex-1 overflow-auto p-3">
    {#each release.active.items as item (item.id)}
      <article class="release-row">
        <div class="min-w-0">
          <div class="flex min-w-0 items-center gap-2">
            <p class="truncate text-sm font-semibold">{item.title}</p>
            <span
              class:badge-update={item.change === "update"}
              class:badge-remove={item.change === "remove"}
              class="admin-badge shrink-0">{changeLabel[item.change]}</span
            >
          </div>
          <p class="mt-1 truncate font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            {item.category}/{item.filename}
          </p>
        </div>
        <button
          type="button"
          on:click={() =>
            requestConfirmation({
              action: "remove-item",
              id: item.id,
              title: item.title,
            })}
          disabled={busy}
          class="shrink-0 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-40"
          >{releaseAction === item.id ? "移出中…" : "移出本次更新"}</button
        >
      </article>
    {:else}
      <div
        class="flex min-h-56 flex-col items-center justify-center text-center"
      >
        <ListRestart size={25} class="text-neutral-300 dark:text-neutral-700" />
        <p class="mt-3 text-sm font-medium">本次更新尚无条目</p>
        <p class="mt-1 max-w-xs text-xs leading-5 text-neutral-400">
          品牌完成批量入库后会自动加入这里，再统一整理版本和更新说明。
        </p>
      </div>
    {/each}
  </div>

  <footer class="border-t border-neutral-100 p-4 dark:border-neutral-800">
    <div class="mb-3 flex items-center justify-between gap-3 text-xs">
      <span
        class:text-amber-600={releaseDirty}
        class:dark:text-amber-400={releaseDirty}
        class="text-neutral-400"
        >{savingRelease
          ? "正在保存草稿…"
          : releaseDirty
            ? "有尚未保存的修改"
            : "草稿已保存"}</span
      >
      <button
        type="button"
        on:click={saveReleaseDraft}
        disabled={!releaseDirty || busy}
        class="admin-secondary-button min-h-8 px-3 py-1.5"
        ><Save size={14} />{savingRelease ? "保存中…" : "保存草稿"}</button
      >
    </div>
    {#if errors.length}
      <div
        class="mb-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
      >
        <AlertTriangle size={15} class="mt-0.5 shrink-0" /><span
          >发布前：{errors.join("；")}</span
        >
      </div>
    {:else}
      <div
        class="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
      >
        <CheckCircle2 size={15} />发布信息完整，请在写入后检查 Git diff。
      </div>
    {/if}
    <div
      class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between"
    >
      <button
        type="button"
        on:click={() => requestConfirmation({ action: "clear" })}
        disabled={!release.active.items.length || busy}
        class="admin-danger-ghost-button"
        ><Trash2 size={15} />清空更新记录</button
      >
      <button
        type="button"
        on:click={publishRelease}
        disabled={busy || errors.length > 0}
        class="admin-primary-button"
        ><Rocket size={15} />{publishing ? "发布中…" : "发布更新日志"}</button
      >
    </div>
  </footer>
</section>

<Dialog bind:open={dialogOpen}>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle
        >{confirmation?.action === "clear"
          ? "清空更新记录？"
          : `移出“${confirmation?.title ?? ""}”？`}</DialogTitle
      >
      <DialogDescription>
        {confirmation?.action === "clear"
          ? "这会清空当前 changelog 草稿的版本、日期、说明与全部条目。"
          : "这会将该品牌从当前 changelog 草稿中移出。"}
      </DialogDescription>
    </DialogHeader>
    <div
      class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
    >
      不会删除已经入库的 SVG、Wordmark、分类 YAML 或品牌元数据。
    </div>
    <DialogFooter class="mt-5 gap-2 sm:gap-0">
      <button
        type="button"
        on:click={closeConfirmation}
        disabled={dialogBusy}
        class="admin-secondary-button">取消</button
      >
      <button
        type="button"
        on:click={confirmAction}
        disabled={dialogBusy}
        class="admin-danger-button"
        >{dialogBusy
          ? "处理中…"
          : confirmation?.action === "clear"
            ? "确认清空草稿"
            : "确认移出记录"}</button
      >
    </DialogFooter>
  </DialogContent>
</Dialog>
