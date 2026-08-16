<script lang="ts">
  /**
   * [INPUT]: 依赖 /admin 本地品牌资产、分类、发布数据、后台客户端 API、草稿状态/规则模块、Navbar、局部工作台组件和 svelte-sonner
   * [OUTPUT]: 对外提供 dev-only 品牌资产工作台；编排新增/更新草稿、即时预检、批量原子入库、可恢复发布草稿与只读资产检索
   * [POS]: routes/admin 的独立维护界面；页面持有跨面板工作流状态，文件匹配、对象 URL 生命周期与 HTTP 传输细节由 lib 客户端领域层分担
   * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
   */

  import { listVariantValues, type AssetVariant } from "@/types/assets";
  import { onDestroy } from "svelte";
  import { toast } from "svelte-sonner";
  import {
    CheckCircle2,
    FileCheck2,
    GitBranch,
    Library,
    ShieldCheck,
    UploadCloud,
  } from "lucide-svelte";
  import "./admin.css";
  import Navbar from "@/components/navbar.svelte";
  import AssetLibraryPanel from "./components/AssetLibraryPanel.svelte";
  import DraftCard from "./components/DraftCard.svelte";
  import ReleasePanel from "./components/ReleasePanel.svelte";
  import {
    publishReleaseBatch,
    runReleaseAction as runReleaseActionRequest,
    saveReleaseDraft as saveReleaseDraftRequest,
    uploadDrafts,
  } from "./lib/admin-api";
  import {
    addFilesToDrafts,
    applyDefaultsToDrafts,
    clearDraftList,
    removeDraftFromList,
    removeWordmarkFromDraft,
    replacePrimaryVariant,
    replaceWordmark,
    upsertUpdateDraft,
  } from "./lib/draft-state";
  import { validateDrafts } from "./lib/draft-rules";
  import type {
    AdminCategory,
    Draft,
    ExistingAsset,
    ReleaseState,
  } from "./types";

  export let data;

  let drafts: Draft[] = [];
  let uploading = false;
  let dragging = false;
  let release = data.release as ReleaseState;

  /* 空日期自动填入当日 */
  if (!release.active.date) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`;
    release = { ...release, active: { ...release.active, date: today } };
  }

  let savedReleaseSignature = JSON.stringify(release.active);
  let savingRelease = false;
  let publishing = false;
  let releaseAction = "";
  let bulkCategory = data.categories[0]?.folder ?? "company";
  let bulkContributor = "";

  $: assets = (data.assets ?? []) as ExistingAsset[];
  $: categories = (data.categories ?? []) as AdminCategory[];
  $: draftErrors = validateDrafts(drafts, assets);
  $: invalidCount = draftErrors.filter((errors) => errors.length).length;
  $: draftFileCount = drafts.reduce(
    (count, draft) =>
      count +
      listVariantValues(draft.primary).length +
      (draft.wordmark ? listVariantValues(draft.wordmark).length : 0),
    0,
  );
  $: bulkDefaults = { category: bulkCategory, contributor: bulkContributor };
  $: releaseDirty = JSON.stringify(release.active) !== savedReleaseSignature;

  function addFiles(fileList: FileList | File[]) {
    try {
      drafts = addFilesToDrafts(drafts, fileList, bulkDefaults, assets);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "请选择 SVG 文件");
    }
  }

  function chooseFiles(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    if (input.files) addFiles(input.files);
    input.value = "";
  }

  function selectedVariant(
    input: HTMLInputElement,
    mode: "single" | "themed",
  ): AssetVariant<File> | undefined {
    const files = Array.from(input.files ?? []);
    if (!files.length) return undefined;
    if (mode === "single") return { kind: "single", file: files[0] };
    if (files.length !== 2) {
      throw new Error("亮暗双版本必须一次选择两个 SVG 文件");
    }
    const light = files.find((file) => /_light\.svg$/i.test(file.name));
    const dark = files.find((file) => /_dark\.svg$/i.test(file.name));
    if (!light || !dark) {
      throw new Error(
        "亮暗双版本文件名必须分别以 _light.svg 和 _dark.svg 结尾",
      );
    }
    return { kind: "themed", light, dark };
  }

  function chooseResource(
    id: string,
    role: "primary" | "wordmark",
    mode: "single" | "themed",
    event: Event,
  ) {
    const input = event.currentTarget as HTMLInputElement;
    try {
      const files = selectedVariant(input, mode);
      if (files) {
        drafts =
          role === "primary"
            ? replacePrimaryVariant(drafts, id, files)
            : replaceWordmark(drafts, id, files);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "选择 SVG 失败");
    }
    input.value = "";
  }

  function chooseAssetUpdate(asset: ExistingAsset, event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    try {
      const mode = typeof asset.file === "string" ? "single" : "themed";
      const files = selectedVariant(input, mode);
      if (files) {
        const previousCount = drafts.length;
        drafts = upsertUpdateDraft(drafts, files, asset);
        toast.success(
          previousCount === drafts.length
            ? `已替换“${asset.title}”更新草稿的主 Logo`
            : `已创建“${asset.title}”更新草稿`,
        );
        requestAnimationFrame(() =>
          document.getElementById("draft-list-title")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "创建更新草稿失败");
    }
    input.value = "";
  }

  function dropFiles(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    if (event.dataTransfer?.files) addFiles(event.dataTransfer.files);
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    drafts = drafts.map((draft) =>
      draft.id === id ? { ...draft, ...patch } : draft,
    );
  }

  function updateResourceFilename(
    id: string,
    role: "primary" | "wordmark",
    slot: "single" | "light" | "dark",
    filename: string,
  ) {
    const draft = drafts.find((item) => item.id === id);
    const variant = draft?.[role];
    if (!draft || !variant) return;
    if (variant.kind === "single" && slot === "single") {
      updateDraft(id, {
        [role]: { kind: "single", file: { ...variant.file, filename } },
      });
    } else if (variant.kind === "themed" && slot !== "single") {
      updateDraft(id, {
        [role]: {
          ...variant,
          [slot]: { ...variant[slot], filename },
        },
      });
    }
  }

  function removeWordmark(id: string) {
    drafts = removeWordmarkFromDraft(drafts, id);
  }

  function removeDraft(id: string) {
    drafts = removeDraftFromList(drafts, id);
  }

  function clearDrafts() {
    drafts = clearDraftList(drafts);
  }

  function applyBulkDefaults() {
    drafts = applyDefaultsToDrafts(drafts, bulkDefaults);
    toast.success(`已将默认值应用到 ${drafts.length} 个品牌草稿`);
  }

  async function ingestDrafts() {
    if (!drafts.length) return toast.error("请先添加品牌资产草稿");
    if (invalidCount) return toast.error(`仍有 ${invalidCount} 个草稿需要修正`);
    uploading = true;
    try {
      const result = await uploadDrafts(drafts);
      release = {
        ...release,
        active: {
          ...release.active,
          items: [...release.active.items, ...result.items],
        },
      };
      savedReleaseSignature = JSON.stringify(release.active);
      toast.success(
        `已原子收录 ${result.count} 个品牌资产、${result.fileCount} 个 SVG，并生成一次前端索引`,
      );
      clearDrafts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "批量入库失败");
    } finally {
      uploading = false;
    }
  }

  async function saveReleaseDraft(showToast = false) {
    savingRelease = true;
    try {
      release = await saveReleaseDraftRequest(release.active);
      savedReleaseSignature = JSON.stringify(release.active);
      if (showToast) toast.success("更新日志草稿已保存");
      return release;
    } catch (error) {
      if (showToast) {
        toast.error(error instanceof Error ? error.message : "保存批次失败");
        return release;
      }
      throw error;
    } finally {
      savingRelease = false;
    }
  }

  async function runReleaseAction(
    action: "remove-item" | "clear",
    id?: string,
  ) {
    releaseAction = id ?? action;
    try {
      if (action === "remove-item") await saveReleaseDraft();
      release = await runReleaseActionRequest(action, id);
      savedReleaseSignature = JSON.stringify(release.active);
      toast.success(
        action === "clear"
          ? "已清空更新记录，已入库资产未受影响"
          : "已移出本次更新，已入库资产未受影响",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新记录操作失败");
    } finally {
      releaseAction = "";
    }
  }

  async function publishRelease() {
    publishing = true;
    try {
      await saveReleaseDraft();
      release = await publishReleaseBatch();
      savedReleaseSignature = JSON.stringify(release.active);
      toast.success("更新日志已写入，请检查 Git diff 后提交");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "发布失败");
    } finally {
      publishing = false;
    }
  }

  onDestroy(clearDrafts);
</script>

<svelte:head><title>Asset Workspace — SVGLOGO</title></svelte:head>

<Navbar currentPath="/admin" />

<main
  class="min-h-screen bg-[#FAFAFA] px-4 py-7 text-neutral-950 dark:bg-neutral-900 dark:text-white sm:px-7"
>
  <div class="mx-auto max-w-[1280px] space-y-6">
    <header
      class="flex flex-col gap-5 border-b border-black/10 pb-6 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between"
    >
      <div>
        <div
          class="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400"
        >
          <GitBranch size={14} class="text-[#06B30C]" /><span>本地资产后台</span
          ><span class="text-neutral-300 dark:text-neutral-700">/</span><span
            >Git 是唯一真相源</span
          >
        </div>
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          品牌资产工作台
        </h1>
        <p
          class="mt-2 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400"
        >
          一张草稿就是一个品牌。主 Logo 与可选 Wordmark
          通过完整预检后，整批共同写入资源、元数据、发布草稿和前端索引。
        </p>
      </div>
      <div
        class="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs dark:border-neutral-800 dark:bg-neutral-800/70"
      >
        <span class="flex items-center gap-2"
          ><Library size={15} class="text-neutral-400" /><b class="text-sm"
            >{assets.length}</b
          ><span class="text-neutral-500 dark:text-neutral-400">现有品牌</span></span
        >
        <span class="h-4 w-px bg-neutral-200 dark:bg-neutral-700"></span>
        <span class="flex items-center gap-2"
          ><FileCheck2 size={15} class="text-neutral-400" /><b class="text-sm"
            >{drafts.length}</b
          ><span class="text-neutral-500 dark:text-neutral-400">待处理</span></span
        >
        <span class="h-4 w-px bg-neutral-200 dark:bg-neutral-700"></span>
        <span class="flex items-center gap-2"
          ><CheckCircle2 size={15} class="text-neutral-400" /><b class="text-sm"
            >{release.active.items.length}</b
          ><span class="text-neutral-500 dark:text-neutral-400">本次更新</span></span
        >
      </div>
    </header>

    <section
      class:lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,.65fr)]={drafts.length}
      class="grid gap-4"
      aria-label="品牌 SVG 导入"
    >
      <div
        role="region"
        aria-label="SVG 文件拖放区"
        class:drop-active={dragging}
        class="drop-zone"
        on:dragenter|preventDefault={() => (dragging = true)}
        on:dragover|preventDefault={() => (dragging = true)}
        on:dragleave|preventDefault={() => (dragging = false)}
        on:drop={dropFiles}
      >
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
        >
          <UploadCloud size={22} />
        </div>
        <div class="min-w-0 flex-1 text-center sm:text-left">
          <h2 class="text-base font-semibold">
            拖放品牌 SVG，或从本地选择文件
          </h2>
          <p class="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            <code>Brand.svg</code>、<code>Brand_wordmark.svg</code> 或完整的
            <code>Brand_light.svg</code>
            / <code>Brand_dark.svg</code> 会严格配对；单个 SVG 不超过 200KB。
          </p>
        </div>
        <label class="admin-primary-button shrink-0 cursor-pointer"
          >选择 SVG 文件<input
            class="sr-only"
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            on:change={chooseFiles}
          /></label
        >
      </div>

      {#if drafts.length}
        <aside class="admin-panel p-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-sm font-semibold">批量默认值</h2>
              <p class="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                只覆盖分类和非空贡献者。
              </p>
            </div>
            <ShieldCheck size={18} class="text-neutral-400" />
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <label class="admin-label"
              >分类<select bind:value={bulkCategory} class="admin-field"
                >{#each categories as category}<option value={category.folder}
                    >{category.name}</option
                  >{/each}</select
              ></label
            >
            <label class="admin-label"
              >贡献者 <span class="font-normal text-neutral-400">可选</span
              ><input
                bind:value={bulkContributor}
                placeholder="GitHub 用户名或署名"
                class="admin-field"
              /></label
            >
          </div>
          <button
            type="button"
            on:click={applyBulkDefaults}
            class="admin-secondary-button mt-3 w-full"
            >应用到全部 {drafts.length} 个草稿</button
          >
        </aside>
      {/if}
    </section>

    {#if drafts.length}
      <section class="space-y-3" aria-labelledby="draft-list-title">
        <div
          class="sticky top-2 z-20 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-lg shadow-black/[0.04] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="px-1">
            <h2 id="draft-list-title" class="text-base font-semibold">
              待入库品牌
            </h2>
            <p class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {drafts.length} 个品牌 / {draftFileCount} 个 SVG · {invalidCount
                ? `${invalidCount} 个品牌需要修正`
                : "预检通过，整批全部成功或全部回滚"}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              on:click={clearDrafts}
              disabled={uploading}
              class="admin-secondary-button flex-1 sm:flex-none"
              >清空草稿</button
            ><button
              type="button"
              on:click={ingestDrafts}
              disabled={uploading || invalidCount > 0}
              class="admin-primary-button flex-1 sm:flex-none"
              >{uploading
                ? "写入中…"
                : `批量入库 ${drafts.length} 个品牌`}</button
            >
          </div>
        </div>

        {#each drafts as draft, index (draft.id)}
          <DraftCard
            {draft}
            {index}
            errors={draftErrors[index]}
            {categories}
            {updateDraft}
            {updateResourceFilename}
            {chooseResource}
            {removeWordmark}
            {removeDraft}
          />
        {/each}
      </section>
    {/if}

    <section class="grid gap-4 xl:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)]">
      <ReleasePanel
        bind:release
        {savingRelease}
        {releaseDirty}
        {publishing}
        {releaseAction}
        saveReleaseDraft={() => saveReleaseDraft(true)}
        {publishRelease}
        {runReleaseAction}
      />
      <AssetLibraryPanel {assets} {categories} {chooseAssetUpdate} />
    </section>
  </div>
</main>

<style>
  .drop-zone {
    display: flex;
    min-height: 7.5rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    border: 1.5px dashed rgb(212 212 212);
    border-radius: 1rem;
    background: white;
    padding: 1.25rem;
    transition:
      border-color 150ms,
      background-color 150ms,
      transform 150ms;
  }

  .drop-zone.drop-active {
    border-color: #06b30c;
    background: rgb(240 253 244);
    transform: translateY(-1px);
  }

  :global(.dark) .drop-zone {
    border-color: rgb(64 64 64);
    background: rgb(38 38 38);
  }
  :global(.dark) .drop-zone.drop-active {
    border-color: #06b30c;
    background: rgb(5 46 22 / 0.3);
  }

  @media (min-width: 640px) {
    .drop-zone {
      flex-direction: row;
      text-align: left;
    }
  }
</style>
