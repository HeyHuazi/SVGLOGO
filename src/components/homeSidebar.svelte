<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { cn } from '@/utils/cn';
  import { svgs } from '@/data/svgs';

  export let selectedCategory: string = '全部';

  // Dynamically extract all categories from data, sort by count desc, "其他" pinned at bottom
  const OTHER_KEY = '其他';
  const displayNames: Record<string, string> = { 'AI产品': 'AI 产品' };

  const uniqueCategories = new Set<string>();
  const rawCounts: Record<string, number> = {};
  svgs.forEach((svg) => {
    const cats = Array.isArray(svg.category) ? svg.category : [svg.category];
    cats.forEach((c) => {
      uniqueCategories.add(c);
      rawCounts[c] = (rawCounts[c] || 0) + 1;
    });
  });

  const sortedCategories = [...uniqueCategories]
    .filter((c) => c !== OTHER_KEY)
    .sort((a, b) => (rawCounts[b] || 0) - (rawCounts[a] || 0));

  const categoryConfig: { label: string; categories: string[] }[] = [
    ...sortedCategories.map((cat) => ({
      label: displayNames[cat] || cat,
      categories: [cat]
    })),
    ...(uniqueCategories.has(OTHER_KEY)
      ? [{ label: OTHER_KEY, categories: [OTHER_KEY] }]
      : [])
  ];

  const totalCount = svgs.length;
  const categoryCounts: Record<string, number> = {};
  categoryConfig.forEach(({ label, categories }) => {
    categoryCounts[label] = categories.reduce((sum, cat) => sum + (rawCounts[cat] || 0), 0);
  });

  const categoryMap: Record<string, string[]> = {
    '全部': [],
    ...Object.fromEntries(categoryConfig.map(({ label, categories }) => [label, categories]))
  };

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
    {#each categoryConfig as { label }}
      <button
        on:click={() => selectCategory(label)}
        class={cn(
          'flex w-full items-center justify-between py-[10px] px-2.5 rounded-[10px] text-sm font-medium transition-colors duration-150',
          selectedCategory === label
            ? 'bg-[#1C1F21] dark:bg-neutral-700 text-white border border-[#1C1F21]/5 dark:border-neutral-600'
            : 'text-[#8A8D8F] dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
        )}
      >
        <span class="truncate" style="font-family: 'InterVariable', system-ui, sans-serif">{label}</span>
        <span class="font-light flex-shrink-0 ml-1" style="font-family: 'InterVariable', system-ui, sans-serif">{categoryCounts[label]}</span>
      </button>
    {/each}
  </nav>
</aside>
