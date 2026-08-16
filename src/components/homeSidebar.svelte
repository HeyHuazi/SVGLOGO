<!--
  [INPUT]: 依赖 svelte 的 createEventDispatcher/onMount/tick，@/utils/cn 的 className 合并，@/data/categories 的分类索引
  [OUTPUT]: 对外提供 HomeSidebar 分类侧栏组件，派发 selectCategory 事件
  [POS]: components 层的新版首页侧栏，被 +page.svelte 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import { cn } from '@/utils/cn';
  import { categories } from '@/data/categories';

  export let selectedCategory: string = '全部';

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  const dispatch = createEventDispatcher();

  // 滑动指示器状态
  let indicatorY = 0;
  let indicatorHeight = 44; // 默认按钮高度
  let navElement: HTMLElement;
  let indicatorVisible = false;

  // 计数动画状态
  let countAnimating = false;
  let previousCategory = selectedCategory;

  // 所有分类（包括"全部"）
  const allCategories = [{ name: '全部', count: totalCount }, ...categories];

  const selectCategory = (cat: string) => {
    selectedCategory = cat;
    dispatch('select', { category: cat });
  };

  // 更新滑动指示器位置
  async function updateIndicator() {
    await tick();
    if (!navElement) return;

    const activeButton = navElement.querySelector(`[data-category="${selectedCategory}"]`) as HTMLElement;
    if (!activeButton) return;

    const navRect = navElement.getBoundingClientRect();
    const btnRect = activeButton.getBoundingClientRect();

    // absolute 元素的 top:0 是相对于 containing block (nav) 的 border-box 顶部
    // 和 offsetTop 的参考点一致，所以可以直接用差值
    indicatorY = btnRect.top - navRect.top + navElement.scrollTop;
    indicatorHeight = btnRect.height;
    indicatorVisible = true;
  }

  // 计数动画
  function triggerCountAnimation() {
    if (selectedCategory !== previousCategory) {
      countAnimating = true;
      setTimeout(() => {
        countAnimating = false;
        previousCategory = selectedCategory;
      }, 200);
    }
  }

  $: if (selectedCategory) {
    updateIndicator();
    triggerCountAnimation();
  }

  onMount(() => {
    // 初始更新指示器位置
    setTimeout(updateIndicator, 100);
  });
</script>

<aside
  class="w-[160px] flex-shrink-0 bg-[#FAFAFA] dark:bg-neutral-900 hidden md:block"
  style="position: sticky; top: 5rem; align-self: flex-start;"
>
  <nav
    bind:this={navElement}
    class="flex flex-col gap-1 pt-[6px] pb-0 max-h-[calc(100vh-80px)] overflow-y-auto relative"
  >
    <!-- 滑动指示器 -->
    {#if indicatorVisible}
      <div
        class="absolute left-0 right-0 bg-[#1C1F21] rounded-[10px] shadow-[#FFFFFF33_0px_0.5px_0px_inset,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_5px_4px_-2px,#0A0A0B05_0px_3px_3px_-1px,#0A0A0B0A_0px_1px_2px_-1px] pointer-events-none z-0"
        style="top: {indicatorY}px; height: {indicatorHeight}px; transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease;"
      />
    {/if}

    <!-- Category items -->
    {#each allCategories as c}
      <button
        data-category={c.name}
        on:click={() => selectCategory(c.name)}
        class={cn(
          'flex w-full items-center justify-between text-sm py-[10px] px-2.5 rounded-[10px] transition-colors duration-150 relative z-10',
          selectedCategory === c.name
            ? 'text-white'
            : 'text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        )}
      >
        <span
          class="truncate font-medium"
          style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif"
        >
          {c.name}
        </span>
        <span
          class="font-light flex-shrink-0 ml-1 transition-transform duration-200 {countAnimating && selectedCategory === c.name ? 'scale-125' : 'scale-100'}"
          style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif"
        >
          {c.count}
        </span>
      </button>
    {/each}
  </nav>
</aside>
