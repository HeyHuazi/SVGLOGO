<!--
  [INPUT]: 依赖 $app/stores 的 page，$app/navigation 的 goto，svelte 的 onMount/onDestroy/fade
  [OUTPUT]: 对外提供 SvelteKit 错误页渲染
  [POS]: routes 层的全局错误边界，承接 SvelteKit 异常
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  import Navbar from '@/components/navbar.svelte';
  import Footer from '@/components/footer.svelte';

  // Footer DOM 引用
  let footerEl: HTMLElement;

  // 倒计时（仅 404）
  let countdown = 6;
  let timer: ReturnType<typeof setInterval>;

  // 拖拽状态
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;

  $: status = $page.status;
  $: errorMessage = $page.error?.message || '';

  // 根据状态码确定文案
  $: config = (() => {
    if (status === 404) {
      return {
        title: '页面走丢了',
        description: '您所访问的页面不存在'
      };
    }
    if (status >= 500) {
      return {
        title: '服务器开小差了',
        description: '服务暂时不可用，请稍后重试'
      };
    }
    return {
      title: '页面异常',
      description: errorMessage || '请求未能成功完成，请稍后重试'
    };
  })();

  // 鼠标拖拽
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startX = e.clientX - currentX;
    startY = e.clientY - currentY;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = e.clientX - startX;
    currentY = e.clientY - startY;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // 触摸拖拽
  function handleTouchStart(e: TouchEvent) {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX - currentX;
    startY = touch.clientY - currentY;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging) return;
    const touch = e.touches[0];
    currentX = touch.clientX - startX;
    currentY = touch.clientY - startY;
  }

  onMount(() => {
    if (status === 404) {
      timer = setInterval(() => {
        countdown -= 1;
        if (countdown <= 0) {
          clearInterval(timer);
          goto('/');
        }
      }, 1000);
    }
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<svelte:head>
  <title>{status} - {config.title} | SVGLOGO</title>
</svelte:head>

<!-- Navbar -->
<Navbar currentPath={$page.url.pathname} />

<!-- 主内容区 -->
<div class="w-full bg-[#FAFAFA] dark:bg-neutral-900 flex-1">
  <div class="max-w-[1280px] mx-auto px-7">
    <div class="flex flex-col items-center justify-center py-24 md:py-32">
      <!-- 404 插画 - 可拖拽 -->
      <div
        class="relative cursor-grab active:cursor-grabbing select-none mb-4 touch-none"
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseUp}
        on:touchstart={handleTouchStart}
        on:touchmove={handleTouchMove}
        on:touchend={handleMouseUp}
        style="transform: translate({currentX}px, {currentY}px); transition: transform {isDragging ? '0s' : '0.2s'};"
        role="button"
        tabindex="0"
        aria-label="可拖拽的 404 图标"
      >
        <img
          src="/images/404.svg"
          alt="页面异常"
          class="w-[168px] h-auto flex-shrink-0 {isDragging ? 'scale-110' : 'scale-100'} transition-transform duration-200"
          draggable="false"
        />
        <p class="text-xs text-neutral-400 mt-2 text-center">试试拖拽我 👆</p>
      </div>

      <!-- 标题 -->
      <p class="text-[20px] font-medium text-black dark:text-white leading-7 mb-1">
        {config.title}
      </p>

      <!-- 描述 -->
      <p class="text-sm text-[#4B5563] dark:text-neutral-400 leading-5 mb-2">
        {config.description}
      </p>

      <!-- 倒计时（仅 404） -->
      {#if status === 404}
        <p class="text-xs text-neutral-400 dark:text-neutral-500 mb-6">
          {countdown}秒后将返回首页
        </p>
      {:else}
        <div class="mb-6"></div>
      {/if}

      <!-- 返回首页按钮 -->
      <a
        href="/"
        class="flex items-center justify-center h-8 px-4 rounded-[10px] bg-[#01B30B] text-white text-xs font-medium shadow-[#FFFFFF40_0px_0.5px_0px_inset,#0A0A0B08_0px_-1px_0px_inset,#007D0559_0px_2px_5px_-2px,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px,#007D05_0px_0px_0px_0.5px] [text-shadow:#0A0A0B26_0px_0.5px_0px] hover:bg-[#02A50C] transition-colors duration-150"
      >
        返回首页
      </a>
    </div>
  </div>
</div>

<!-- Footer -->
<Footer bind:element={footerEl} />
