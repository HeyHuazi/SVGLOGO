<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.status} - 页面异常 | SVGLOGO</title>
</svelte:head>

<main class="min-h-[100dvh] flex items-center justify-center px-6 py-12 bg-white dark:bg-neutral-900">
  <div class="w-full max-w-xl rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center">
    <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-2">页面发生异常</p>
    <h1 class="text-4xl font-bold text-neutral-900 dark:text-white mb-4">{$page.status}</h1>
    <p class="text-neutral-600 dark:text-neutral-300 mb-8">
      {$page.error?.message || '请求未能成功完成，请稍后重试。'}
    </p>

    <div class="flex items-center justify-center gap-3">
      <a
        href="/"
        class="inline-flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        返回首页
      </a>
      <a
        href="/explore"
        class="inline-flex items-center rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm hover:opacity-90"
      >
        前往探索
      </a>
    </div>
  </div>
</main>
