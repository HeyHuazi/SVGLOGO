<script lang="ts">
  import type { LayoutServerData } from '../$types';
  export let data: LayoutServerData;

  // 仅保留必要组件
  import { ModeWatcher, mode } from 'mode-watcher';
  import Transition from '@/components/transition.svelte';
  import { Toaster } from 'svelte-sonner';
</script>

<ModeWatcher />

<style>
  /* 强制重置 - 彻底移除左侧空白 */
  :global(body),
  :global(html) {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }
  
  :global(main) {
    margin: 0 !important;
    padding: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100dvh !important;
  }
  
  /* 彻底隐藏全局布局元素 */
  :global(aside),
  :global(nav[class*="sidebar"]),
  :global(.ad-popup),
  :global(.ad-container),
  :global([class*="sidebar"]),
  :global([class*="fixed"]:not(.toaster):not([class*="toast"])) {
    display: none !important;
    visibility: hidden !important;
  }
  
  /* 重置所有可能的容器样式 */
  :global(.container),
  :global([class*="container"]),
  :global([class*="ml-"]),
  :global([class*="margin-left"]) {
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    max-width: none !important;
    width: 100% !important;
  }
  
  /* 确保页面内容从最左侧开始 */
  :global(*) {
    box-sizing: border-box;
  }
  
  /* 特殊处理：移除可能的Tailwind类影响 */
  :global(.md\:ml-56),
  :global(.md\:ml-\[224px\]) {
    margin-left: 0 !important;
  }
</style>

<!-- 完全独立的全宽布局 -->
<main class="w-full min-h-[100dvh] bg-white dark:bg-neutral-900">
  <Transition pathname={data.pathname}>
    <slot />
  </Transition>
  <Toaster
    position="bottom-right"
    theme={$mode}
    class="toaster group"
    toastOptions={{
      classes: {
        toast: 'group toast dark:group-[.toaster]:bg-neutral-900 group-[.toaster]:font-sans',
        description: 'group-[.toast]:text-xs font-mono'
      }
    }}
  />
</main>