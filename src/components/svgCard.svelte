<script lang="ts">
  import type { iSVG } from '@/types/svg';
  import { cn } from '@/utils/cn';
  import { getSvgContent } from '@/utils/getSvgContent';
  import { LinkIcon, ChevronsRight, Baseline, Sparkles } from 'lucide-svelte';
  import DownloadSvg from './downloadSvg.svelte';
  import CopySvg from './copySvg.svelte';

  // Figma
  import { onMount } from 'svelte';
  import { insertSVG as figmaInsertSVG } from '@/figma/insert-svg';
  import { mode } from 'mode-watcher';

  export let svgInfo: iSVG;
  export let index = 0;

  // 网格列数（xl:grid-cols-5）
  const COLUMNS = 5;

  let isInFigma = false;
  onMount(() => {
    const searchParams = new URLSearchParams(window.location.search);
    isInFigma = searchParams.get('figma') === '1';
  });

  // Wordmark toggle
  let wordmarkSvg = false;

  // 图片加载状态
  let imageLoaded = false;

  // 根据当前主题选择正确的图片 src（只渲染 1 张，不是 2 张）
  $: isDark = $mode === 'dark';
  $: imgSrc = (() => {
    if (wordmarkSvg) {
      const w = svgInfo.wordmark;
      if (typeof w !== 'string' && w) {
        return isDark ? (w.dark || '') : (w.light || '');
      }
      return w || '';
    }
    const r = svgInfo.route;
    if (typeof r !== 'string') {
      return isDark ? r.dark : r.light;
    }
    return r;
  })();

  // 图片 src 变化时重置加载状态
  $: if (imgSrc) { imageLoaded = false; }

  const insertSVG = async (url?: string) => {
    const content = (await getSvgContent(url)) as string;
    figmaInsertSVG(content);
  };

  // Icon Stroke & Size:
  let iconStroke = 1.8;
  let iconSize = 16;

  // 计算动画延迟：基于行号（从上到下依次出现）
  $: row = Math.floor(index / COLUMNS);
  $: animationDelay = Math.min(row * 50, 500); // 每行延迟 50ms，最多 500ms
</script>

<div
  class="animate-fade-in-up flex flex-col items-center w-full h-[180.5px] bg-white dark:bg-[#2A2C2D] rounded-[15px] overflow-hidden border-[0.5px] border-[#1C1F211A] dark:border-[#FFFFFF26] shadow-[0px_0.5px_0px_#0A0A0B12,0px_9px_5px_-2px_#0A0A0B03,0px_5px_4px_-1px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B0A] dark:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_9px_5px_-2px_#0A0A0B06,0px_5px_4px_-1px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B1A] hover:shadow-[0px_0.5px_0px_#0A0A0B12,0px_4px_6px_-1px_#0A0A0B0A,0px_9px_5px_-2px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B07] dark:hover:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_4px_6px_-1px_#0A0A0B1A,0px_9px_5px_-2px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B12] transition-shadow duration-200"
  style:animation-delay="{animationDelay}ms"
>
  <!-- Logo Area -->
  <div class="flex items-center justify-center w-full flex-1 bg-[radial-gradient(ellipse_54.24%_130.95%_at_50%_50.3%,#FFFFFF,#F5F5F5)] dark:bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#2A2C2D,#252728)] py-5 px-5 min-h-[86px] relative">
    {#if !imageLoaded}
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-16 h-5 rounded bg-neutral-100 dark:bg-neutral-700 animate-pulse"></div>
      </div>
    {/if}
    <img
      class="max-w-[148px] max-h-[36px] object-contain select-none transition-opacity duration-200 {imageLoaded ? 'opacity-100' : 'opacity-0'}"
      src={imgSrc}
      alt={svgInfo.title}
      title={svgInfo.title}
      loading="lazy"
      on:load={() => (imageLoaded = true)}
    />
  </div>

  <!-- Title Area -->
  <div class="flex flex-col items-center gap-0.5 w-full pt-2 pb-1.5 px-3">
    <div class="w-full overflow-hidden">
      <p class="text-[13px] font-medium text-[#171717] dark:text-white text-center truncate leading-[150%]">
        {svgInfo.title}
      </p>
    </div>
    <div class="flex items-center gap-1 justify-center">
      <span class="text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3] leading-[150%]">
        {#if svgInfo.wordmark !== undefined}
          支持标识/组合切换
        {:else}
          SVG 矢量格式
        {/if}
      </span>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="flex items-center gap-1 justify-center w-full py-1.5 px-2">
    {#if isInFigma}
      <button
        title="插入到 Figma"
        on:click={() => {
          const svgHasTheme = typeof svgInfo.route !== 'string';
          if (!svgHasTheme) {
            insertSVG(typeof svgInfo.route === 'string' ? svgInfo.route : '');
            return;
          }
          const dark = document.documentElement.classList.contains('dark');
          insertSVG(typeof svgInfo.route !== 'string' ? (dark ? svgInfo.route.dark : svgInfo.route.light) : svgInfo.route);
        }}
        class="flex items-center justify-center rounded-md p-2 text-[#737373] dark:text-[#737373] duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-700/40"
      >
        <ChevronsRight size={iconSize} strokeWidth={iconStroke} />
      </button>
    {/if}

    {#if wordmarkSvg}
      <CopySvg {iconSize} {iconStroke} {svgInfo} isWordmarkSvg={true} />
    {:else}
      <CopySvg {iconSize} {iconStroke} {svgInfo} isWordmarkSvg={false} />
    {/if}

    <DownloadSvg
      {svgInfo}
      isDarkTheme={() => document.documentElement.classList.contains('dark')}
    />

    {#if svgInfo.url && svgInfo.category !== '气象预警'}
      <a
        href={svgInfo.url}
        title="官网"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center rounded-md p-2 text-[#737373] dark:text-[#737373] duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-700/40"
      >
        <LinkIcon size={iconSize} strokeWidth={iconStroke} />
      </a>
    {/if}

    {#if svgInfo.wordmark !== undefined}
      <button
        title={wordmarkSvg ? '显示标识' : '显示组合'}
        on:click={() => (wordmarkSvg = !wordmarkSvg)}
        class="flex items-center justify-center rounded-md p-2 text-[#737373] dark:text-[#737373] duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-700/40"
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
