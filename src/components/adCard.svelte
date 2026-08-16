<!--
  [INPUT]: 依赖 svelte 的 onMount
  [OUTPUT]: 对外提供 AdCard 组件，延迟加载外部广告脚本
  [POS]: components 层的首页广告卡片，被 +page.svelte 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { onMount } from 'svelte';

  export let index = 0;

  // 网格列数（xl:grid-cols-5）
  const COLUMNS = 5;

  // 计算动画延迟：基于行号（从上到下依次出现）
  $: row = Math.floor(index / COLUMNS);
  $: animationDelay = Math.min(row * 50, 500); // 每行延迟 50ms，最多 500ms

  let adLoaded = false;
  let adElement: HTMLElement;

  onMount(() => {
    // 延迟加载广告（避免阻塞首屏）
    const timer = setTimeout(() => {
      try {
        // 检查广告脚本是否已加载
        if (typeof window !== 'undefined' && 'adsbygoogle' in window) {
          // @ts-ignore - AdSense 全局对象
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adLoaded = true;
        }
      } catch (e) {
        console.error('AdSense 加载失败:', e);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });
</script>

<div
  class="animate-fade-in-up relative flex flex-col items-center w-full h-[180.5px] bg-white dark:bg-[#2A2C2D] rounded-[15px] overflow-hidden border-[0.5px] border-[#1C1F211A] dark:border-[#FFFFFF26] shadow-[0px_0.5px_0px_#0A0A0B12,0px_9px_5px_-2px_#0A0A0B03,0px_5px_4px_-1px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B0A] dark:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_9px_5px_-2px_#0A0A0B06,0px_5px_4px_-1px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B1A] hover:shadow-[0px_0.5px_0px_#0A0A0B12,0px_4px_6px_-1px_#0A0A0B0A,0px_9px_5px_-2px_#0A0A0B05,0px_2px_3px_-1px_#0A0A0B07] dark:hover:shadow-[0px_0.5px_0px_#0A0A0B2D,0px_4px_6px_-1px_#0A0A0B1A,0px_9px_5px_-2px_#0A0A0B0D,0px_2px_3px_-1px_#0A0A0B12] transition-shadow duration-200"
  style:animation-delay="{animationDelay}ms"
>
  <!-- 广告标识 -->
  <div class="absolute top-2 right-2 z-10 text-[10px] text-[#A3A3A3] dark:text-[#A3A3A3] bg-neutral-100/80 dark:bg-neutral-800/80 px-2 py-0.5 rounded backdrop-blur-sm">
    广告
  </div>

  <!-- 广告内容区域 -->
  <div 
    class="flex items-center justify-center w-full h-full bg-[radial-gradient(ellipse_54.24%_130.95%_at_50%_50.3%,#FFFFFF,#F5F5F5)] dark:bg-[radial-gradient(circle_farthest-corner_at_50%_50%,#2A2C2D,#252728)]"
    bind:this={adElement}
  >
    <!-- Google AdSense 广告 -->
    <ins
      class="adsbygoogle"
      style="display:block; width:100%; max-height:100%;"
      data-ad-client="ca-pub-7984938986090440"
      data-ad-slot="7544531871"
      data-ad-format="rectangle"
    ></ins>
  </div>
</div>
