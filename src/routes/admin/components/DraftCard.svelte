<!--
  [INPUT]: 依赖 routes/admin/types 的变体品牌草稿、types/assets 资源枚举、分类数据与父页面资源/元数据回调
  [OUTPUT]: 对外提供单品牌草稿编辑卡，编辑 single/themed 主 Logo、可选 Wordmark、元数据、写入路径与阻塞错误
  [POS]: routes/admin/components 的草稿编辑单元；操作类型由显式既有品牌目标派生，不持有批次状态或执行写入
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { listVariantValues, type AssetVariant } from "@/types/assets";
  import {
    AlertCircle,
    CheckCircle2,
    FileImage,
    Link2,
    Trash2,
    Type,
    Upload,
  } from "lucide-svelte";
  import type { AdminCategory, Draft, SvgResource } from "../types";

  export let draft: Draft;
  export let index: number;
  export let errors: string[];
  export let categories: AdminCategory[];
  export let updateDraft: (id: string, patch: Partial<Draft>) => void;
  export let updateResourceFilename: (
    id: string,
    role: "primary" | "wordmark",
    slot: "single" | "light" | "dark",
    filename: string,
  ) => void;
  export let chooseResource: (
    id: string,
    role: "primary" | "wordmark",
    mode: "single" | "themed",
    event: Event,
  ) => void;
  export let removeWordmark: (id: string) => void;
  export let removeDraft: (id: string) => void;

  $: titleError = errors.some((error) => error.includes("展示名称"));
  $: primaryError = errors.some(
    (error) => error.startsWith("主 Logo") || error.includes("主 Logo文件名"),
  );
  $: wordmarkError =
    Boolean(draft.wordmark) &&
    errors.some(
      (error) =>
        error.startsWith("Wordmark") || error.includes("Wordmark文件名"),
    );
  $: urlError = errors.some((error) => error.includes("官网地址"));
  $: fileCount =
    listVariantValues(draft.primary).length +
    (draft.wordmark ? listVariantValues(draft.wordmark).length : 0);

  const fieldClass = (invalid = false) =>
    `admin-field ${invalid ? "admin-field-error" : ""}`;

  function displayFilename(filename: string) {
    return filename.replace(/\.svg$/iu, "");
  }

  function toFullFilename(value: string) {
    const trimmed = value.trim();
    return /\.svg$/iu.test(trimmed) ? trimmed : `${trimmed}.svg`;
  }

  function slotEntries(variant: AssetVariant<SvgResource>) {
    return variant.kind === "single"
      ? [{ slot: "single" as const, label: "单一版本", resource: variant.file }]
      : [
          {
            slot: "light" as const,
            label: "亮色界面使用",
            resource: variant.light,
          },
          {
            slot: "dark" as const,
            label: "暗色界面使用",
            resource: variant.dark,
          },
        ];
  }
</script>

<article
  class="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-black/[0.02] dark:border-neutral-800 dark:bg-neutral-800"
>
  <header
    class="flex flex-col gap-3 border-b border-neutral-100 px-4 py-3.5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex min-w-0 items-center gap-3">
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 font-mono text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        >{index + 1}</span
      >
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="truncate text-sm font-semibold">
            {draft.title || "未命名品牌"}
          </h3>
          <span
            class:badge-update={draft.operation === "update"}
            class="admin-badge"
            >{draft.operation === "update" ? "更新" : "新增"}</span
          >
          <span class:status-error={errors.length} class="status-badge">
            {#if errors.length}<AlertCircle
                size={13}
              />需修正{:else}<CheckCircle2 size={13} />可入库{/if}
          </span>
        </div>
        <p class="mt-0.5 text-xs text-neutral-400">
          {fileCount} 个 SVG · {draft.primary.kind === "themed"
            ? "主题主 Logo"
            : "单一主 Logo"}{draft.wordmark ? " + Wordmark" : ""}
        </p>
      </div>
    </div>
    <button
      type="button"
      aria-label={`移除 ${draft.title || "未命名品牌"} 草稿`}
      on:click={() => removeDraft(draft.id)}
      class="admin-icon-button self-end text-neutral-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900 dark:hover:bg-red-950/30 sm:self-auto"
    >
      <Trash2 size={16} />
    </button>
  </header>

  <div
    class="grid gap-4 p-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(360px,1.25fr)]"
  >
    <section class:resource-error={primaryError} class="resource-card">
      <div class="mb-2.5 flex items-center justify-between gap-3">
        <span
          class="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
          ><FileImage size={14} />主 Logo</span
        >
        <span class="admin-badge"
          >{draft.primary.kind === "themed" ? "亮暗双版本" : "单一版本"}</span
        >
      </div>
      <div
        class="grid gap-3"
        class:grid-cols-2={draft.primary.kind === "themed"}
      >
        {#each slotEntries(draft.primary) as entry}
          <div>
            <p class="mb-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              {entry.label}
            </p>
            <div
              class="asset-preview"
              class:bg-neutral-800={entry.slot === "dark"}
            >
              <img
                src={entry.resource.preview}
                alt={`${draft.title} ${entry.label}`}
                class="max-h-full max-w-full"
              />
            </div>
            <label class="admin-label mt-2"
              >文件名
              <input
                value={displayFilename(entry.resource.filename)}
                on:input={(event) =>
                  updateResourceFilename(
                    draft.id,
                    "primary",
                    entry.slot,
                    toFullFilename(event.currentTarget.value),
                  )}
                class={fieldClass(primaryError)}
              />
            </label>
          </div>
        {/each}
      </div>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <label
          class="admin-secondary-button cursor-pointer justify-center text-xs"
          >替换单一版本
          <input
            class="sr-only"
            type="file"
            accept=".svg,image/svg+xml"
            on:change={(event) =>
              chooseResource(draft.id, "primary", "single", event)}
          />
        </label>
        <label
          class="admin-secondary-button cursor-pointer justify-center text-xs"
          >替换亮暗双版本
          <input
            class="sr-only"
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            on:change={(event) =>
              chooseResource(draft.id, "primary", "themed", event)}
          />
        </label>
      </div>
    </section>

    <section class:resource-error={wordmarkError} class="resource-card">
      <div class="mb-2.5 flex items-center justify-between gap-3">
        <span
          class="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
          ><Type size={14} />Wordmark
          <span class="font-normal text-neutral-400">可选</span></span
        >
        {#if draft.wordmark}<button
            type="button"
            on:click={() => removeWordmark(draft.id)}
            class="text-xs font-medium text-red-500 hover:text-red-700"
            >移除关联</button
          >{/if}
      </div>
      {#if draft.wordmark}
        <div
          class="grid gap-3"
          class:grid-cols-2={draft.wordmark.kind === "themed"}
        >
          {#each slotEntries(draft.wordmark) as entry}
            <div>
              <p class="mb-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
                {entry.label}
              </p>
              <div
                class="asset-preview"
                class:bg-neutral-800={entry.slot === "dark"}
              >
                <img
                  src={entry.resource.preview}
                  alt={`${draft.title} Wordmark ${entry.label}`}
                  class="max-h-full max-w-full"
                />
              </div>
              <label class="admin-label mt-2"
                >文件名
                <input
                  value={displayFilename(entry.resource.filename)}
                  on:input={(event) =>
                    updateResourceFilename(
                      draft.id,
                      "wordmark",
                      entry.slot,
                      toFullFilename(event.currentTarget.value),
                    )}
                  class={fieldClass(wordmarkError)}
                />
              </label>
            </div>
          {/each}
        </div>
      {:else}
        <div class="wordmark-empty">
          <Upload size={18} /><span
            class="font-medium text-neutral-700 dark:text-neutral-200"
            >添加关联 Wordmark</span
          ><span>可选择单一版本或完整 light/dark 对</span>
        </div>
      {/if}
      <div class="mt-3 grid grid-cols-2 gap-2">
        <label
          class="admin-secondary-button cursor-pointer justify-center text-xs"
          >{draft.wordmark ? "替换" : "添加"}单一版本
          <input
            class="sr-only"
            type="file"
            accept=".svg,image/svg+xml"
            on:change={(event) =>
              chooseResource(draft.id, "wordmark", "single", event)}
          />
        </label>
        <label
          class="admin-secondary-button cursor-pointer justify-center text-xs"
          >{draft.wordmark ? "替换" : "添加"}亮暗双版本
          <input
            class="sr-only"
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            on:change={(event) =>
              chooseResource(draft.id, "wordmark", "themed", event)}
          />
        </label>
      </div>
    </section>

    <section class="content-start">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="admin-label"
          >展示名称
          <input
            value={draft.title}
            on:input={(event) =>
              updateDraft(draft.id, { title: event.currentTarget.value })}
            placeholder="网站中展示的品牌名称"
            class={fieldClass(titleError)}
          />
        </label>
        <label class="admin-label"
          >分类
          <select
            value={draft.category}
            disabled={draft.operation === "update"}
            on:change={(event) =>
              updateDraft(draft.id, { category: event.currentTarget.value })}
            class="admin-field"
          >
            {#each categories as category}<option value={category.folder}
                >{category.name}</option
              >{/each}
          </select>
        </label>
        <div class="admin-label">
          入库操作
          <div
            class="admin-field flex items-center text-sm text-neutral-600 dark:text-neutral-300"
          >
            {draft.operation === "update"
              ? "更新已绑定品牌（自动识别）"
              : "新增品牌（自动识别）"}
          </div>
        </div>
        <label class="admin-label"
          >官网 <span class="font-normal text-neutral-400">可选</span>
          <span class="relative flex items-center"
            ><Link2
              size={14}
              class="pointer-events-none absolute left-3 text-neutral-400"
            /><input
              value={draft.url}
              on:input={(event) =>
                updateDraft(draft.id, { url: event.currentTarget.value })}
              placeholder="https://example.com"
              class={`${fieldClass(urlError)} !mt-0 pl-9`}
            /></span
          >
        </label>
        <label class="admin-label sm:col-span-2"
          >贡献者 <span class="font-normal text-neutral-400">可选</span>
          <input
            value={draft.contributor}
            on:input={(event) =>
              updateDraft(draft.id, { contributor: event.currentTarget.value })}
            placeholder="GitHub 用户名或署名"
            class="admin-field"
          />
        </label>
      </div>

      <div class="mt-4 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900/70">
        <p
          class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400"
        >
          写入位置
        </p>
        {#each listVariantValues(draft.primary) as item}<code
            class="block break-all text-xs text-neutral-600 dark:text-neutral-300"
            >static/library/{draft.category}/{item.filename}</code
          >{/each}
        {#if draft.wordmark}{#each listVariantValues(draft.wordmark) as item}<code
              class="mt-1 block break-all text-xs text-emerald-600 dark:text-emerald-400"
              >static/library/{draft.category}/{item.filename}</code
            >{/each}{/if}
      </div>

      {#if errors.length}
        <div
          class="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/70 dark:bg-red-950/25"
        >
          <p
            class="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-300"
          >
            <AlertCircle size={14} />入库前需要修正
          </p>
          <ul class="space-y-1 text-xs text-red-600 dark:text-red-400">
            {#each errors as error}<li>• {error}</li>{/each}
          </ul>
        </div>
      {/if}
    </section>
  </div>
</article>
