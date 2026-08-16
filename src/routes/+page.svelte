<!--
  [INPUT]: 依赖 svelte 的 onMount，@/data 的 svgsData，@/data/categories 的分类索引，@/types/svg 的 iSVG，sveltekit-search-params 的 queryParam
  [OUTPUT]: 对外提供新版首页渲染，支持搜索/分类/排序/渐进加载/广告混排，并为首屏 Logo 分配图片请求优先级
  [POS]: routes 层的核心首页，消费生成数据索引并协调首屏资源调度
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { svgsData } from '@/data';
  import { categories } from '@/data/categories';
  import type { iSVG } from '@/types/svg';
  import { queryParam } from 'sveltekit-search-params';
  import { ArrowUpDownIcon, ArrowDownUpIcon, Loader, ArrowUp } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  import Navbar from '@/components/navbar.svelte';
  import HeroSection from '@/components/heroSection.svelte';
  import HomeSearch from '@/components/homeSearch.svelte';
  import HomeSidebar from '@/components/homeSidebar.svelte';
  import SvgCard from '@/components/svgCard.svelte';
  import AdCard from '@/components/adCard.svelte';
  import Footer from '@/components/footer.svelte';
  import { pinyinMatch } from '@/utils/pinyin';
  import EmptyState from '@/components/emptyState.svelte';

  const allSvgs: iSVG[] = svgsData;

  // URL 参数（仅用于写入同步，不参与响应式）
  const searchParam = queryParam('search');
  const categoryParam = queryParam('category');
  const sortParam = queryParam('sort');

  // Category index: generated once from static/library metadata.
  const categoryMap: Record<string, string[]> = {
    '全部': [],
    ...Object.fromEntries(categories.map((category) => [category.name, [category.slug]]))
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
  const HIGH_PRIORITY_LOGO_COUNT = GRID_COLUMNS;
  const EAGER_LOGO_COUNT = GRID_COLUMNS * 2;

  type ImageLoadPriority = 'high' | 'normal' | 'low';

  function getImageLoadPriority(logoIndex: number): ImageLoadPriority {
    if (logoIndex < HIGH_PRIORITY_LOGO_COUNT) return 'high';
    if (logoIndex < EAGER_LOGO_COUNT) return 'normal';
    return 'low';
  }

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
      if (!svg?.title) return; // 跳过无效数据
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
    [...list].filter(Boolean).sort((a, b) => (b?.id ?? 0) - (a?.id ?? 0));

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
        const svgCats = Array.isArray(svg?.category) ? svg.category : [svg?.category];
        return svgCats?.some((c) => cats.includes(c));
      });
    }

    if (isSearching) {
      result = result.filter((svg) => pinyinMatch(svg?.title || '', query));
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
    const newCategory = e.detail.category;
    // 只有当分类真正改变时才清空列表并重新加载
    if (newCategory !== selectedCategory) {
      selectedCategory = newCategory;
      $categoryParam = selectedCategory !== '全部' ? selectedCategory : null;
      // 立即清空当前列表，避免新旧图片请求争抢连接池
      filteredSvgs = { list: [], total: 0, isSearching: false };
      visibleCount = INITIAL_VISIBLE_COUNT;
      // 滚动到结果区域
      setTimeout(() => {
        const resultsElement = document.getElementById('results-header');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  // 排序切换（点击切换）
  function toggleSort() {
    sortBy = sortBy === 'recent' ? 'default' : 'recent';
    $sortParam = sortBy === 'default' ? 'default' : null;
    visibleCount = INITIAL_VISIBLE_COUNT;
  }

  function loadMore() {
    if (isLoadingMore) return;
    isLoadingMore = true;
    // 模拟加载延迟以展示 loading 状态
    setTimeout(() => {
      visibleCount = Math.min(visibleCount + LOAD_BATCH_SIZE, filteredSvgs.total);
      isLoadingMore = false;
    }, 300);
  }

  function handleScroll() {
    showScrollTop = window.scrollY > 500;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Footer observer for search bar opacity
  let footerElement: HTMLElement;
  let footerOpacity = 1;

  // 加载更多状态
  let isLoadingMore = false;

  // 回到顶部按钮显示状态
  let showScrollTop = false;

  // 无限滚动自动加载
  let loadMoreSentinel: HTMLElement;
  let autoLoadObserver: IntersectionObserver | null = null;

  // 设置自动加载观察器
  function setupAutoLoad() {
    if (!loadMoreSentinel) return;
    
    // 清理旧观察器
    if (autoLoadObserver) {
      autoLoadObserver.disconnect();
    }
    
    autoLoadObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingMore && !filteredSvgs.isSearching && filteredSvgs.total > filteredSvgs.list.length) {
          loadMore();
        }
      },
      { rootMargin: '300px' } // 提前 300px 开始加载
    );
    
    autoLoadObserver.observe(loadMoreSentinel);
  }

  // sentinel 元素挂载时立即建立 observer
  function sentinelBind(node: HTMLElement) {
    loadMoreSentinel = node;
    setTimeout(() => setupAutoLoad(), 0);
  }

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

    // 监听滚动显示回到顶部按钮
    window.addEventListener('scroll', handleScroll, { passive: true });

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
        <div id="results-header" class="flex items-center justify-between mb-4 sticky top-16 md:top-20 z-10 bg-[#FAFAFA] dark:bg-neutral-900 py-2 -mx-0">
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
            {#if item?.type === 'svg' && item?.data?.title}
              <SvgCard
                svgInfo={item.data}
                index={item.index ?? 0}
                imageLoadPriority={getImageLoadPriority(item.index ?? 0)}
                showGroup={selectedCategory === '全部' && searchTerm.trim().length > 0}
              />
            {:else if item.type === 'ad'}
              <AdCard index={item.index || 0} />
            {/if}
          {/each}
        </div>

        <!-- Empty State -->
        {#if filteredSvgs.list.length === 0}
          <EmptyState searchTerm={searchTerm} />
        {/if}

        <!-- Load More & Auto-load Sentinel -->
        {#if !filteredSvgs.isSearching}
          {#if filteredSvgs.total > filteredSvgs.list.length}
            <div class="flex items-center justify-center mt-8">
              <button
                on:click={loadMore}
                disabled={isLoadingMore}
                class="flex items-center gap-2 h-10 px-5 rounded-full border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {#if isLoadingMore}
                  <Loader size={16} class="animate-spin" />
                  <span>加载中...</span>
                {:else}
                  <span>加载更多</span>
                  <span class="text-neutral-400 dark:text-neutral-500">
                    （还剩 {filteredSvgs.total - filteredSvgs.list.length}）
                  </span>
                {/if}
              </button>
            </div>
            <!-- 自动加载 sentinel -->
            <div use:sentinelBind class="h-1 mt-4" aria-hidden="true" />
          {:else if filteredSvgs.list.length > 0}
            <!-- 已加载全部 -->
            <div class="flex items-center justify-center mt-8 text-sm text-neutral-400 dark:text-neutral-500">
              已显示全部 {filteredSvgs.total} 个标志
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Scroll to Top Button -->
{#if showScrollTop}
  <button
    on:click={scrollToTop}
    class="fixed bottom-24 right-6 md:bottom-8 md:right-8 p-3 rounded-full bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:scale-110 hover:shadow-xl transition-all duration-200 z-40"
    aria-label="回到顶部"
    transition:fade={{ duration: 200 }}
  >
    <ArrowUp size={20} class="text-neutral-600 dark:text-neutral-300" />
  </button>
{/if}

<!-- Fixed Bottom Search -->
<HomeSearch
  bind:searchTerm
  totalCount={filteredSvgs.total}
  opacity={footerOpacity}
  on:search={handleSearch}
/>

<!-- Footer -->
<Footer bind:element={footerElement} />
