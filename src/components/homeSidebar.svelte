<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cn } from '@/utils/cn';
  import { categories } from '@/data/categories';

  export let selectedCategory: string = '全部';

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  const dispatch = createEventDispatcher();

  const selectCategory = (cat: string) => {
    selectedCategory = cat;
    dispatch('select', { category: cat });
  };
</script>

<aside
  class="w-[160px] flex-shrink-0 bg-[#FAFAFA] dark:bg-neutral-900 hidden md:block"
  style="position: sticky; top: 5rem; align-self: flex-start;"
>
  <nav class="flex flex-col gap-0 pt-[6px] pb-0 max-h-[calc(100vh-80px)] overflow-y-auto">
    <!-- "全部" item -->
    <button
      on:click={() => selectCategory('全部')}
      class={cn(
        'flex w-full items-center justify-between py-[10px] px-2.5 rounded-[10px] text-sm font-medium transition-colors duration-150',
        selectedCategory === '全部'
          ? 'bg-[#1C1F21] dark:bg-neutral-700 text-white border border-[#1C1F21]/5 dark:border-neutral-600'
          : 'text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
      )}
    >
      <span style="font-family: 'InterVariable', system-ui, sans-serif">全部</span>
      <span class="font-light" style="font-family: 'InterVariable', system-ui, sans-serif">{totalCount}</span>
    </button>

    <!-- Category items -->
    {#each categories as c}
      <button
        on:click={() => selectCategory(c.name)}
        class={cn(
          'flex w-full items-center justify-between py-[10px] px-2.5 rounded-[10px] text-sm font-medium transition-colors duration-150',
          selectedCategory === c.name
            ? 'bg-[#1C1F21] dark:bg-neutral-700 text-white border border-[#1C1F21]/5 dark:border-neutral-600'
            : 'text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
        )}
      >
        <span class="truncate" style="font-family: 'InterVariable', system-ui, sans-serif">{c.name}</span>
        <span class="font-light flex-shrink-0 ml-1" style="font-family: 'InterVariable', system-ui, sans-serif">{c.count}</span>
      </button>
    {/each}
  </nav>
</aside>
