<!--
  [INPUT]: 依赖 routes/admin/types 的现有资产与分类、父页面变体更新草稿回调，使用 lucide-svelte 提供搜索、维护和外链反馈
  [OUTPUT]: 对外提供现有品牌检索面板，支持标题/资源搜索、分类过滤，并为 single/themed 主 Logo 创建完整更新草稿
  [POS]: routes/admin/components 的资产索引与维护入口；只选择 replacement SVG，不直接修改资产事务
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { ArrowUpRight, FilePenLine, Layers3, Search, X } from "lucide-svelte";
  import type { AdminCategory, AssetFile, ExistingAsset } from "../types";

  export let assets: ExistingAsset[];
  export let categories: AdminCategory[];
  export let chooseAssetUpdate: (asset: ExistingAsset, event: Event) => void;

  let query = "";
  let category = "all";

  function fileLabel(value: AssetFile | undefined) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return [`light: ${value.light}`, `dark: ${value.dark}`].join(" / ");
  }

  function resetFilters() {
    query = "";
    category = "all";
  }

  $: normalizedQuery = query.trim().toLocaleLowerCase();
  $: filteredAssets = assets.filter((asset) => {
    const haystack =
      `${asset.title} ${fileLabel(asset.file)} ${fileLabel(asset.wordmark)}`.toLocaleLowerCase();
    return (
      (!normalizedQuery || haystack.includes(normalizedQuery)) &&
      (category === "all" || asset.category === category)
    );
  });
  $: filtered = Boolean(normalizedQuery || category !== "all");
</script>

<section
  class="admin-panel flex h-[32rem] flex-col"
  aria-labelledby="asset-library-title"
>
  <header
    class="flex flex-col gap-3 border-b border-neutral-100 p-5 dark:border-neutral-800 sm:flex-row sm:items-start sm:justify-between"
  >
    <div>
      <div class="flex items-center gap-2">
        <Layers3 size={18} class="text-neutral-400" />
        <h2 id="asset-library-title" class="text-base font-semibold">
          现有品牌资产
        </h2>
      </div>
      <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        单一主 Logo 选择一个 replacement；主题主 Logo 一次选择完整的 _light.svg
        / _dark.svg 对。
      </p>
    </div>
    <span class="admin-count">{filteredAssets.length} / {assets.length}</span>
  </header>

  <div
    class="grid gap-2 border-b border-neutral-100 p-4 dark:border-neutral-800 sm:grid-cols-[1fr_160px]"
  >
    <label class="sr-only" for="asset-search">搜索现有品牌资产</label>
    <div class="relative flex items-center">
      <Search
        size={14}
        class="pointer-events-none absolute left-3 text-neutral-400"
      />
      <input
        id="asset-search"
        bind:value={query}
        placeholder="搜索展示名称、Logo 或 Wordmark"
        class="admin-field !mt-0 pl-9 pr-9"
      />
      {#if query}<button
          type="button"
          aria-label="清空搜索"
          on:click={() => (query = "")}
          class="absolute right-2 flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          ><X size={14} /></button
        >{/if}
    </div>
    <label class="sr-only" for="asset-category">筛选资产分类</label>
    <select id="asset-category" bind:value={category} class="admin-field"
      ><option value="all">全部分类</option>{#each categories as item}<option
          value={item.folder}>{item.name}</option
        >{/each}</select
    >
  </div>

  <div class="min-h-0 flex-1 overflow-auto p-3">
    {#each filteredAssets.slice(0, 100) as asset}
      <article class="asset-row">
        <div class="min-w-0">
          <div class="flex min-w-0 items-center gap-2">
            <p class="truncate text-sm font-semibold">{asset.title}</p>
            <span class="admin-badge shrink-0">{asset.category}</span>
          </div>
          <p class="mt-1 truncate font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            Logo · {fileLabel(asset.file)}
          </p>
          {#if asset.wordmark}<p
              class="mt-0.5 truncate font-mono text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              Wordmark · {fileLabel(asset.wordmark)}
            </p>{/if}
        </div>
        <div class="flex shrink-0 items-center gap-1.5">
          <label
            title={`更新 ${asset.title}`}
            class="admin-icon-button cursor-pointer"
          >
            <FilePenLine size={15} />
            <span class="sr-only">选择新的 SVG 更新 {asset.title}</span>
            <input
              class="sr-only"
              type="file"
              accept=".svg,image/svg+xml"
              multiple={typeof asset.file !== "string"}
              on:change={(event) => chooseAssetUpdate(asset, event)}
            />
          </label>
          {#if asset.url}<a
              href={asset.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`打开 ${asset.title} 官网`}
              title="打开官网"
              class="admin-icon-button"><ArrowUpRight size={15} /></a
            >{/if}
        </div>
      </article>
    {:else}
      <div
        class="flex min-h-64 flex-col items-center justify-center text-center"
      >
        <Search size={24} class="text-neutral-300 dark:text-neutral-700" />
        <p class="mt-3 text-sm font-medium">没有匹配资产</p>
        <p class="mt-1 text-xs text-neutral-400">调整关键词或分类后再试。</p>
        {#if filtered}<button
            type="button"
            on:click={resetFilters}
            class="admin-secondary-button mt-4">清除筛选</button
          >{/if}
      </div>
    {/each}
  </div>

  {#if filteredAssets.length > 100}
    <footer
      class="border-t border-neutral-100 px-4 py-3 text-center text-xs text-neutral-400 dark:border-neutral-800"
    >
      匹配 {filteredAssets.length} 个，当前展示前 100 个，请继续缩小搜索范围。
    </footer>
  {/if}
</section>
