<script lang="ts">
  import { onMount } from 'svelte';
  import { svgsData } from '@/data';
  import type { iSVG } from '@/types/svg';
  import { queryParam } from 'sveltekit-search-params';
  import { ArrowUpDownIcon, ArrowDownUpIcon } from 'lucide-svelte';

  import Navbar from '@/components/navbar.svelte';
  import HeroSection from '@/components/heroSection.svelte';
  import HomeSearch from '@/components/homeSearch.svelte';
  import HomeSidebar from '@/components/homeSidebar.svelte';
  import SvgCard from '@/components/svgCard.svelte';
  import AdCard from '@/components/adCard.svelte';
  import Footer from '@/components/footer.svelte';
  import EmptyState from '@/components/emptyState.svelte';

  const allSvgs: iSVG[] = svgsData;

  // URL 参数（仅用于写入同步，不参与响应式）
  const searchParam = queryParam('search');
  const categoryParam = queryParam('category');
  const sortParam = queryParam('sort');

  // Dynamically build category map from data (matches sidebar logic)
  const OTHER_KEY = '其他';
  const displayNames: Record<string, string> = { 'AI产品': 'AI 产品' };

  const uniqueCategories = new Set<string>();
  const rawCounts: Record<string, number> = {};
  allSvgs.forEach((svg) => {
    const cats = Array.isArray(svg.category) ? svg.category : [svg.category];
    cats.forEach((c) => {
      uniqueCategories.add(c);
      rawCounts[c] = (rawCounts[c] || 0) + 1;
    });
  });

  const sortedCategories = [...uniqueCategories]
    .filter((c) => c !== OTHER_KEY)
    .sort((a, b) => (rawCounts[b] || 0) - (rawCounts[a] || 0));

  const categoryMap: Record<string, string[]> = {
    '全部': [],
    ...Object.fromEntries(
      sortedCategories.map((cat) => [displayNames[cat] || cat, [cat]])
    ),
    ...(uniqueCategories.has(OTHER_KEY) ? { [OTHER_KEY]: [OTHER_KEY] } : {})
  };

  // State
  let searchTerm = '';
  let selectedCategory = '全部';
  let sortBy: 'default' | 'recent' = 'recent';

  // Progressive loading
  const INITIAL_VISIBLE_COUNT = 30;
  const LOAD_BATCH_SIZE = 60;
  let visibleCount = INITIAL_VISIBLE_COUNT;

  // 广告配置
  const AD_INTERVAL = 15; // 每15个logo插入一个广告
  const AD_START_POSITION = 5; // 从第5个位置开始插入广告
  const GRID_COLUMNS = 5; // 网格最大列数（xl:grid-cols-5）

  // 计算广告位置
  function getAdPositions(total: number): number[] {
    const positions: number[] = [];
    for (let i = AD_START_POSITION; i < total; i += AD_INTERVAL) {
      // 在 i-2 到 i+2 范围内随机选择位置
      const randomOffset = Math.floor(Math.random() * 5) - 2;
      const position = i + randomOffset;
      if (position < total && !positions.includes(position)) {
        positions.push(position);
      }
    }
    return positions.sort((a, b) => a - b);
  }

  // 混合 logo 和广告
  function renderMixedContent(svgs: iSVG[], adPositions: number[]) {
    const result: Array<{ type: 'svg' | 'ad'; data?: iSVG; index?: number }> = [];
    let adIndex = 0;

    svgs.forEach((svg, i) => {
      if (adPositions.includes(i)) {
        result.push({ type: 'ad', index: adIndex++ });
      }
      result.push({ type: 'svg', data: svg, index: i });
    });

    return result;
  }

  // Reactive: filtered results
  let filteredSvgs: { list: iSVG[]; total: number; isSearching: boolean } = { list: [], total: 0, isSearching: false };
  $: adPositions = getAdPositions(filteredSvgs.total);
  $: mixedContent = renderMixedContent(filteredSvgs.list, adPositions);

  // 搜索时自动滚动到页面顶部
  $: if (searchTerm.trim()) {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }

  const sortByLatest = (list: iSVG[]) =>
    [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  const getVisibleSvgs = (list: iSVG[], isSearching: boolean) => {
    if (isSearching) return list;
    const base = Math.min(visibleCount, list.length);
    // 计算当前范围内有多少广告
    const adCount = getAdPositions(base).length;
    const totalItems = base + adCount;
    // 向上取整到 GRID_COLUMNS 的倍数，多取一些 logo 补齐最后一行
    const remainder = totalItems % GRID_COLUMNS;
    const needed = remainder === 0 ? 0 : GRID_COLUMNS - remainder;
    const adjusted = Math.min(base + needed, list.length);
    return list.slice(0, adjusted);
  };

  $: {
    const query = searchTerm.trim().toLowerCase();
    const isSearching = query.length > 0;
    const cats = categoryMap[selectedCategory] || [];
    const isCategoryFilter = cats.length > 0;

    let result: iSVG[] = allSvgs;

    if (isCategoryFilter) {
      result = result.filter((svg) => {
        const svgCats = Array.isArray(svg.category) ? svg.category : [svg.category];
        return svgCats.some((c) => cats.includes(c));
      });
    }

    if (isSearching) {
      result = result.filter((svg) => svg.title.toLowerCase().includes(query));
    }

    // Sort
    const sorted = sortBy === 'recent' ? sortByLatest(result) : [...result];

    if (!isSearching && visibleCount > sorted.length) {
      visibleCount = sorted.length;
    }

    filteredSvgs = {
      list: getVisibleSvgs(sorted, isSearching),
      total: sorted.length,
      isSearching
    };
  }

  function handleSearch(e: CustomEvent) {
    searchTerm = e.detail.value;
    $searchParam = searchTerm || null;
    visibleCount = INITIAL_VISIBLE_COUNT;
  }

  function handleCategorySelect(e: CustomEvent) {
    selectedCategory = e.detail.category;
    $categoryParam = selectedCategory !== '全部' ? selectedCategory : null;
    visibleCount = INITIAL_VISIBLE_COUNT;
  }

  // 排序切换（点击切换）
  function toggleSort() {
    sortBy = sortBy === 'recent' ? 'default' : 'recent';
    $sortParam = sortBy === 'default' ? 'default' : null;
    visibleCount = INITIAL_VISIBLE_COUNT;
  }

  function loadMore() {
    visibleCount = Math.min(visibleCount + LOAD_BATCH_SIZE, filteredSvgs.total);
  }

  // Footer observer for search bar opacity
  let footerElement: HTMLElement;
  let footerOpacity = 1;

  onMount(async () => {
    // 从 URL 参数一次性恢复状态（避免响应式循环）
    const urlParams = new URLSearchParams(window.location.search);
    const urlSearch = urlParams.get('search');
    const urlCategory = urlParams.get('category');
    const urlSort = urlParams.get('sort');
    if (urlSearch) searchTerm = urlSearch;
    if (urlCategory) selectedCategory = urlCategory;
    if (urlSort === 'default') sortBy = 'default';

    // 监听浏览器前进/后退恢复状态
    window.addEventListener('popstate', () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get('search') || '';
      const c = params.get('category') || '全部';
      const sort = params.get('sort');
      if (searchTerm !== s) { searchTerm = s; visibleCount = INITIAL_VISIBLE_COUNT; }
      if (selectedCategory !== c) { selectedCategory = c; visibleCount = INITIAL_VISIBLE_COUNT; }
      const newSort: 'default' | 'recent' = sort === 'default' ? 'default' : 'recent';
      if (sortBy !== newSort) { sortBy = newSort; visibleCount = INITIAL_VISIBLE_COUNT; }
    });

    // 等待组件渲染完成，确保 bind:element 已生效
    const { tick } = await import('svelte');
    await tick();

    // 响应式等待 footerElement 绑定完成
    const waitForElement = () => {
      if (!footerElement) {
        requestAnimationFrame(waitForElement);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          // 搜索中时保持搜索栏可见，不随 footer 位置隐藏
          if (filteredSvgs.isSearching) {
            footerOpacity = 1;
            return;
          }
          // Gradually hide search bar as footer comes into view
          // ratio 0 → opacity 1 (not visible), ratio 1 → opacity 0 (fully visible)
          footerOpacity = Math.max(0, 1 - entry.intersectionRatio * 1.5);
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
      );
      observer.observe(footerElement);
    };

    waitForElement();
  });
</script>

<svelte:head>
  <title>SVGLOGO - 专注收录国内矢量 LOGO</title>
  <meta name="description" content="免费下载矢量 LOGO 素材，专注收录国内矢量 LOGO，为设计师提供高质量的品牌标识资源。" />
</svelte:head>

<!-- Navbar -->
<Navbar currentPath="/" />

<!-- Hero Section -->
<HeroSection />

<!-- Separator line -->
<div class="w-full bg-[#FAFAFA] dark:bg-neutral-900">
  <div class="max-w-[1280px] mx-auto px-7">
    <div class="h-px bg-neutral-800/10 dark:bg-neutral-200/10"></div>
  </div>
</div>

<!-- Main Content: Sidebar + Cards -->
<div class="w-full bg-[#FAFAFA] dark:bg-neutral-900 min-h-screen pb-24">
  <div class="max-w-[1280px] mx-auto px-7 py-3">
    <div class="flex gap-6">
      <!-- Sidebar (sticky) -->
      <HomeSidebar
        bind:selectedCategory
        on:select={handleCategorySelect}
      />

      <!-- Cards Grid -->
      <div class="flex-1 min-w-0 pb-4">
        <!-- Results header: info + sort (sticky) -->
        <div class="flex items-center justify-between mb-4 sticky top-16 md:top-20 z-10 bg-[#FAFAFA] dark:bg-neutral-900 py-2 -mx-0">
          <p class="text-sm font-medium text-neutral-800 dark:text-neutral-300">
            {#if searchTerm}
              搜索 "{searchTerm}" 找到 {filteredSvgs.total} 个结果
            {:else if selectedCategory !== '全部'}
              {selectedCategory} · {filteredSvgs.total} 个标志
            {:else}
              共 {filteredSvgs.total} 个矢量标志
            {/if}
          </p>
          <!-- Sort toggle button -->
          <button
            on:click={toggleSort}
            class="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={sortBy === 'recent' ? '切换为默认排序' : '切换为最近更新'}
          >
            {#if sortBy === 'recent'}
              <ArrowUpDownIcon size={16} strokeWidth={2} class="text-neutral-400 dark:text-neutral-500" />
            {:else}
              <ArrowDownUpIcon size={16} strokeWidth={2} class="text-neutral-400 dark:text-neutral-500" />
            {/if}
            <span>{sortBy === 'recent' ? '最近更新' : '默认排序'}</span>
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {#each mixedContent as item, i}
            {#if item.type === 'svg' && item.data}
              <SvgCard svgInfo={item.data} index={item.index || 0} />
            {:else if item.type === 'ad'}
              <AdCard index={item.index || 0} />
            {/if}
          {/each}
        </div>

        <!-- Empty State -->
        {#if filteredSvgs.list.length === 0}
          <EmptyState searchTerm={searchTerm} />
        {/if}

        <!-- Load More -->
        {#if !filteredSvgs.isSearching && filteredSvgs.total > filteredSvgs.list.length}
          <div class="flex items-center justify-center mt-8">
            <button
              on:click={loadMore}
              class="flex items-center gap-2 h-10 px-5 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              加载更多
              <span class="text-neutral-400 dark:text-neutral-500">
                （还剩 {filteredSvgs.total - filteredSvgs.list.length}）
              </span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Fixed Bottom Search -->
<HomeSearch
  bind:searchTerm
  totalCount={filteredSvgs.total}
  opacity={footerOpacity}
  on:search={handleSearch}
/>

<!-- Footer -->
<Footer bind:element={footerElement} />
