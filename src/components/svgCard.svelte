<script lang="ts">
  /**
   * [INPUT]: 依赖 iSVG、types/assets 统一主题解析、mode-watcher、CopySvg、DownloadSvg 与调用方图片加载优先级
   * [OUTPUT]: 对外提供 SvgCard，支持分级图片请求、可恢复加载状态、主题资源、复制、下载、官网与 Wordmark 切换
   * [POS]: components 的核心卡片视图，被首页与目录页复用；执行加载策略但不重复解释资源存储结构
   * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
   */
  import { resolveStoredAsset } from "@/types/assets";
  import type { iSVG } from "@/types/svg";
  import { LinkIcon, Baseline, Sparkles } from "lucide-svelte";
  import { mode } from "mode-watcher";
  import DownloadSvg from "./downloadSvg.svelte";
  import CopySvg from "./copySvg.svelte";

  export let svgInfo: iSVG;
  export let index = 0;
  export let showGroup = false;
  export let imageLoadPriority: "high" | "normal" | "low" = "low";

  let imageLoading: "eager" | "lazy";
  let imageFetchPriority: "high" | "auto" | "low";
  $: imageLoading = imageLoadPriority === "low" ? "lazy" : "eager";
  $: imageFetchPriority =
    imageLoadPriority === "high"
      ? "high"
      : imageLoadPriority === "low"
        ? "low"
        : "auto";

  // 网格列数（xl:grid-cols-5）
  const COLUMNS = 5;

  // Wordmark toggle
  let wordmarkSvg = false;

  // 图片加载状态
  let imageLoaded = false;
  let imageFailed = false;
  let previousImgSrc = "";

  function syncImageState(node: HTMLImageElement, _src: string) {
    const sync = () => {
      if (!node.complete) return;
      imageLoaded = node.naturalWidth > 0;
      imageFailed = node.naturalWidth === 0;
    };

    // hydration 时图片可能已经完成，等待当前 DOM 属性应用后读取事实状态。
    queueMicrotask(sync);

    return {
      update() {
        queueMicrotask(sync);
      },
    };
  }

  // 根据当前主题选择正确的图片 src（只渲染 1 张，不是 2 张）
  $: isDark = $mode === "dark";
  $: imgSrc = (() => {
    const asset = wordmarkSvg ? svgInfo.wordmark : svgInfo.route;
    return asset
      ? resolveStoredAsset(
          asset,
          isDark ? "dark" : "light",
          `${svgInfo.title}${wordmarkSvg ? " Wordmark" : " 主 Logo"}`,
        )
      : "";
  })();

  // 图片 src 变化时重置加载状态
  $: if (imgSrc !== previousImgSrc) {
    previousImgSrc = imgSrc;
    imageLoaded = false;
    imageFailed = false;
  }

  // Icon Stroke & Size:
  let iconStroke = 1.8;
  let iconSize = 16;

  // 计算动画延迟：基于行号（从上到下依次出现）
  $: row = Math.floor(index / COLUMNS);
  $: animationDelay = Math.min(row * 50, 500); // 每行延迟 50ms，最多 500ms
</script>

<div
  class="animate-fade-in-up flex h-[180.5px] w-full flex-col items-center overflow-hidden rounded-[15px] border-[0.5px] border-[#1C1F211A] bg-white shadow-[0px_0.5px_0px_#0A0A0B12,0px_9px_5px_-2px_#0A0A0B03,0px_5px_4px_-1px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B0A] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0px_0.5px_0px_#0A0A0B12,0px_4px_6px_-1px_#0A0A0B0A,0px_9px_5px_-2px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B07] dark:border-[#FFFFFF26] dark:bg-[#2A2C2D] dark:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_9px_5px_-2px_#0A0A0B06,0px_5px_4px_-1px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B1A] dark:hover:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_4px_6px_-1px_#0A0A0B1A,0px_9px_5px_-2px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B12]"
  style:animation-delay="{animationDelay}ms"
>
  <!-- Logo Area -->
  <div
    class="relative flex min-h-[86px] w-full flex-1 items-center justify-center bg-[radial-gradient(ellipse_54.24%_130.95%_at_50%_50.3%,#FFFFFF,#F5F5F5)] px-5 py-5 dark:bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#2A2C2D,#252728)]"
  >
    {#if imageFailed}
      <p class="text-xs text-neutral-400 dark:text-neutral-500">预览加载失败</p>
    {:else if !imageLoaded}
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="h-5 w-16 animate-pulse rounded bg-neutral-100 dark:bg-neutral-700"
        ></div>
      </div>
    {/if}
    <img
      class="max-h-[36px] max-w-[148px] select-none object-contain transition-opacity duration-200 {imageLoaded
        ? 'opacity-100'
        : 'opacity-0'}"
      src={imgSrc}
      alt={svgInfo.title}
      title={svgInfo.title}
      loading={imageLoading}
      fetchpriority={imageFetchPriority}
      decoding="async"
      use:syncImageState={imgSrc}
      on:load={() => {
        imageLoaded = true;
        imageFailed = false;
      }}
      on:error={() => {
        imageLoaded = false;
        imageFailed = true;
      }}
    />
  </div>

  <!-- Title Area -->
  <div class="flex w-full flex-col items-center gap-0.5 px-3 pb-1.5 pt-2">
    <div class="relative w-full overflow-hidden">
      <p
        class="truncate text-center text-[13px] font-medium leading-[150%] text-[#171717] dark:text-white"
        title={svgInfo.title}
      >
        {svgInfo.title}
      </p>
    </div>
    <div class="flex items-center justify-center gap-1">
      <span
        class="text-[10px] leading-[150%] text-[#A3A3A3] dark:text-[#A3A3A3]"
      >
        {#if showGroup}
          {Array.isArray(svgInfo.category)
            ? svgInfo.category.join(" / ")
            : svgInfo.category}
        {:else if svgInfo.wordmark !== undefined}
          支持标识/组合切换
        {:else}
          SVG 矢量格式
        {/if}
      </span>
    </div>
  </div>

  <!-- Action Buttons -->
  <div
    class="flex w-full items-center justify-center gap-1 rounded-lg bg-neutral-50/50 px-2 py-1.5 dark:bg-neutral-800/30"
  >
    {#if wordmarkSvg}
      <CopySvg {iconSize} {iconStroke} {svgInfo} isWordmarkSvg={true} />
    {:else}
      <CopySvg {iconSize} {iconStroke} {svgInfo} isWordmarkSvg={false} />
    {/if}

    <DownloadSvg
      {svgInfo}
      isDarkTheme={() => document.documentElement.classList.contains("dark")}
    />

    {#if svgInfo.url && svgInfo.category !== "气象预警"}
      <a
        href={svgInfo.url}
        title="官网"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-2 text-[#737373] duration-100 hover:bg-neutral-200 dark:text-[#737373] dark:hover:bg-neutral-700/40"
        aria-label="访问官网"
      >
        <LinkIcon size={iconSize} strokeWidth={iconStroke} />
      </a>
    {/if}

    {#if svgInfo.wordmark !== undefined}
      <button
        title={wordmarkSvg ? "显示标识" : "显示组合"}
        on:click={() => (wordmarkSvg = !wordmarkSvg)}
        class="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-md p-2 text-[#737373] duration-100 hover:bg-neutral-200 dark:text-[#737373] dark:hover:bg-neutral-700/40"
        aria-label={wordmarkSvg ? "显示标识" : "显示组合"}
      >
        {#if wordmarkSvg}
          <Sparkles size={iconSize} strokeWidth={iconStroke} />
        {:else}
          <Baseline size={iconSize} strokeWidth={iconStroke} />
        {/if}
      </button>
    {/if}
  </div>
</div>
