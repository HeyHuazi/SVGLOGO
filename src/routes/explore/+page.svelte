<script lang="ts">
  import type { iSVG } from '@/types/svg';
  import { cn } from '@/utils/cn';
  import { queryParam } from 'sveltekit-search-params';

  // Get all svgs:
  import { svgsData } from '@/data';
  const allSvgs: iSVG[] = svgsData;

  // Components:
  import Search from '@/components/search.svelte';
  import Container from '@/components/container.svelte';
  import SvgCard from '@/components/svgCard.svelte';
  import Grid from '@/components/grid.svelte';
  import NotFound from '@/components/notFound.svelte';

  // URL params
  const searchParam = queryParam('search');

  // Icons:
  import { ArrowDown, ArrowDownUpIcon, ArrowUpDownIcon } from 'lucide-svelte';
  import { buttonStyles } from '@/ui/styles';

  const INITIAL_VISIBLE_COUNT = 30;
  const LOAD_BATCH_SIZE = 150;

  let sorted = false;

  // Search:
  let searchTerm = $searchParam || '';
  let filteredSvgs: iSVG[] = [];
  let totalMatchedCount = 0;
  let visibleCount = INITIAL_VISIBLE_COUNT;

  const sortByLatest = (list: iSVG[]) =>
    [...list].sort((a, b) => {
      const aId = a.id ?? 0;
      const bId = b.id ?? 0;
      return bId - aId;
    });

  const sortAlphabetically = (list: iSVG[]) =>
    [...list].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));

  const resetVisibleCount = () => {
    visibleCount = INITIAL_VISIBLE_COUNT;
  };

  const getVisibleSvgs = (list: iSVG[], isSearching: boolean) => {
    if (isSearching) {
      return list;
    }

    const safeVisibleCount = Math.min(visibleCount, list.length);
    return list.slice(0, safeVisibleCount);
  };

  const updateSearchParam = () => {
    $searchParam = searchTerm || null;
  };

  const searchSvgs = () => {
    resetVisibleCount();
    updateSearchParam();
  };

  // Clear search:
  const clearSearch = () => {
    searchTerm = '';
    resetVisibleCount();
    updateSearchParam();
  };

  // Sort:
  const sort = () => {
    sorted = !sorted;
  };

  const loadMoreSvgs = () => {
    if (totalMatchedCount <= visibleCount) {
      return;
    }

    visibleCount = Math.min(visibleCount + LOAD_BATCH_SIZE, totalMatchedCount);
  };

  $: {
    const query = searchTerm.trim().toLowerCase();
    const isSearching = query.length > 0;

    const searchedSvgs = isSearching
      ? allSvgs.filter((svg) => svg.title.toLowerCase().includes(query))
      : allSvgs;

    const sortedSvgs = sorted ? sortAlphabetically(searchedSvgs) : sortByLatest(searchedSvgs);
    totalMatchedCount = sortedSvgs.length;

    if (!isSearching && visibleCount > totalMatchedCount) {
      visibleCount = totalMatchedCount;
    }

    filteredSvgs = getVisibleSvgs(sortedSvgs, isSearching);
  }
</script>

<svelte:head>
  <title>收录国内矢量 LOGO - SVGLOGO</title>
</svelte:head>

<Search
  bind:searchTerm
  on:input={searchSvgs}
  clearSearch={() => clearSearch()}
  placeholder={`搜索 ${totalMatchedCount} 个 Logo...`}
/>

<Container>
  <div class="flex items-center justify-end mb-4">
    <button
      class={cn(
        'flex items-center justify-center space-x-1 rounded-md px-3 py-1.5 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity',
        filteredSvgs.length === 0 && 'hidden'
      )}
      on:click={() => sort()}
      aria-label={sorted ? '切换为按最新排序' : '切换为按字母顺序排序'}
    >
      {#if sorted}
        <ArrowDownUpIcon size={16} strokeWidth={2} class="mr-1" />
      {:else}
        <ArrowUpDownIcon size={16} strokeWidth={2} class="mr-1" />
      {/if}
      <span>{sorted ? '按最新排序' : '按字母顺序排序'}</span>
    </button>
  </div>

  <Grid>
    {#each filteredSvgs as svg}
      <SvgCard svgInfo={svg} />
    {/each}
  </Grid>

  {#if searchTerm.trim().length === 0 && totalMatchedCount > filteredSvgs.length}
    <div class="flex items-center justify-center mt-4">
      <button class={buttonStyles} on:click={loadMoreSvgs}>
        <div class="flex items-center space-x-2 relative">
          <ArrowDown size={16} strokeWidth={2} />
          <span>加载更多</span>
          <span class="opacity-70">
            (还剩 {totalMatchedCount - filteredSvgs.length})
          </span>
        </div>
      </button>
    </div>
  {/if}

  {#if filteredSvgs.length === 0}
    <NotFound notFoundTerm={searchTerm} />
  {/if}
</Container>
