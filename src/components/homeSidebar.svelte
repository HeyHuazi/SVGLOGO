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

  // Paper设计稿样式：选中状态的按钮样式
  const selectedStyle = `
    background-color: #1C1F21;
    background-image: linear-gradient(in oklab 0deg, oklab(66.5% -0.178 0.136 / 0%) 0%, oklab(100% -.0001 .0001 / 10%) 100%);
    border-color: #1C1F21;
    border-radius: 10px;
    border-style: solid;
    border-width: 0.5px;
    box-shadow: #FFFFFF33 0px 0.5px 0px inset, #0A0A0B12 0px 0.5px 0px, #0A0A0B03 0px 5px 4px -2px, #0A0A0B05 0px 3px 3px -1px, #0A0A0B0A 0px 1px 2px -1px;
    padding-block: 10px;
    padding-inline: 10px;
  `;
</script>

<aside
  class="w-[160px] flex-shrink-0 bg-[#FAFAFA] dark:bg-neutral-900 hidden md:block"
  style="position: sticky; top: 5rem; align-self: flex-start;"
>
  <nav class="flex flex-col gap-1 pt-[6px] pb-0 max-h-[calc(100vh-80px)] overflow-y-auto">
    <!-- "全部" item -->
    <button
      on:click={() => selectCategory('全部')}
      class={cn(
        'flex w-full items-center justify-between text-sm transition-all duration-150',
        selectedCategory === '全部'
          ? 'text-white'
          : 'py-[10px] px-2.5 rounded-[10px] text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
      )}
      style={selectedCategory === '全部' ? selectedStyle : ''}
    >
      <span class="font-medium" style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif">全部</span>
      <span class="font-light" style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif">{totalCount}</span>
    </button>

    <!-- Category items -->
    {#each categories as c}
      <button
        on:click={() => selectCategory(c.name)}
        class={cn(
          'flex w-full items-center justify-between text-sm transition-all duration-150',
          selectedCategory === c.name
            ? 'text-white'
            : 'py-[10px] px-2.5 rounded-[10px] text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        )}
        style={selectedCategory === c.name ? selectedStyle : ''}
      >
        <span class="truncate font-medium" style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif">{c.name}</span>
        <span class="font-light flex-shrink-0 ml-1" style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif">{c.count}</span>
      </button>
    {/each}
  </nav>
</aside>
