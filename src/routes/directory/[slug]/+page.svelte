<!--
  [INPUT]: 依赖 ./$types 的 PageData，@/types/svg 的 iSVG，sveltekit-search-params 的 queryParam，旧组件集（Container/Grid/Search/SvgCard/NotFound）
  [OUTPUT]: 对外提供旧目录页分类导航视图
  [POS]: routes/directory/[slug] 的降级路由，基于分类 slug 过滤 SVG
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import type { PageData } from './$types';
  import type { iSVG } from '@/types/svg';
  import { queryParam } from 'sveltekit-search-params';

  export let data: PageData;
  const svgsByCategory: iSVG[] = data.svgs || [];
  const category = data.category || '';

  // Components:
  import { pinyinMatch } from '@/utils/pinyin';
  import Container from '@/components/container.svelte';
  import Grid from '@/components/grid.svelte';
  import Search from '@/components/search.svelte';
  import SvgCard from '@/components/svgCard.svelte';
  import NotFound from '@/components/notFound.svelte';

  // URL params
  const searchParam = queryParam('search');

  // Search:
  let searchTerm = $searchParam || '';
  let filteredSvgs: iSVG[] = [];
  let totalMatchedCount = 0;

  const sortAlphabetically = (list: iSVG[]) =>
    [...list].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));

  const updateSearchParam = () => {
    $searchParam = searchTerm || null;
  };

  const searchSvgs = () => {
    updateSearchParam();
  };

  const clearSearch = () => {
    searchTerm = '';
    updateSearchParam();
  };

  $: {
    const query = searchTerm.trim().toLowerCase();
    const searchedSvgs =
      query.length === 0
        ? svgsByCategory
        : svgsByCategory.filter((svg) => pinyinMatch(svg?.title || '', query));

    filteredSvgs = sortAlphabetically(searchedSvgs);
    totalMatchedCount = filteredSvgs.length;
  }
</script>

<svelte:head>
  <title>{category} SVGLOGO </title>
</svelte:head>

<Container>
  <Search
    bind:searchTerm
    on:input={searchSvgs}
    clearSearch={() => clearSearch()}
    placeholder={`搜索 ${totalMatchedCount} 个 ${category} Logo...`}
  />
  <Grid>
    {#each filteredSvgs as svg}
      <SvgCard svgInfo={svg} />
    {/each}
  </Grid>
  {#if filteredSvgs.length === 0}
    <NotFound notFoundTerm={searchTerm} />
  {/if}
</Container>
