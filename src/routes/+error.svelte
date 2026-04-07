<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';

  import Navbar from '@/components/navbar.svelte';
  import Footer from '@/components/footer.svelte';

  // Footer DOM 引用
  let footerEl: HTMLElement;

  // 倒计时（仅 404）
  let countdown = 6;
  let timer: ReturnType<typeof setInterval>;

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
      <!-- 404 插画 -->
      <img
        src="/images/404.svg"
        alt="页面异常"
        class="w-[168px] h-auto flex-shrink-0 mb-4"
      />

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
