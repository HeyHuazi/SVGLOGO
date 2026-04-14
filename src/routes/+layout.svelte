<script lang="ts">
import type { LayoutServerData } from "./$types";
export let data: LayoutServerData;

// 51LA 统计 ID（从环境变量读取，未设置则不启用统计）
import { PUBLIC_51LA_ID } from '$env/static/public';

// Global styles:
import "../app.css";
import { cn } from "@/utils/cn";
import { page } from '$app/stores';
import { ModeWatcher, mode } from "mode-watcher";
import { sidebarCategoryCountStyles } from "@/ui/styles";
import { sidebarItemStyles } from "@/ui/styles";
import { onMount, onDestroy } from 'svelte';
import { X } from "lucide-svelte";

// 动态更新 theme-color
$: if (typeof document !== 'undefined') {
  const themeColor = $mode === 'dark' ? '#171717' : '#FAFAFA';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', themeColor);
  }
}

// 广告弹窗状态
let showAdPopup = true;
let prefersReducedMotion = false;

const closeAdPopup = () => {
  showAdPopup = false;
  stopAutoplay();
};

// Banner数据
const banners = [
  {
    id: 1,
    imageUrl: "https://huazispace.s3.bitiful.net/2025/02/5fe4e4e7b9f554b781ef566a9adc80f2.png",
    link: "https://xiaobot.net/p/DesignStroll",
    alt: "设计漫步周刊"
  },
  {
    id: 2,
    imageUrl: "https://designstrollweekly.s3.bitiful.net/2025/09/9062b3659c91942d9f20dd85e19cbe6c.png",
    link: "https://www.evoker.design?atp=huazi",
    alt: "Evoker"
  },
  {
    id: 3,
    imageUrl: "https://huazispace.s3.bitiful.net/2025/07/efb43de563174a798867fbc016e280a8.png",
    link: "https://bizihu.com/?ref=www.huazi.space",
    alt: "壁纸湖"
  }
];

// 轮播状态
let currentBannerIndex = 0;
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

function nextBanner() {
  currentBannerIndex = (currentBannerIndex + 1) % banners.length;
}

function startAutoplay() {
  if (prefersReducedMotion || !showAdPopup || banners.length <= 1) {
    return;
  }
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    nextBanner();
  }, 5000);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

// Get categories from precomputed index:
import { categories as categoryIndex } from "@/data/categories";
const categories = categoryIndex.map(c => c.name);
const categoryCounts = Object.fromEntries(categoryIndex.map(c => [c.name, c.count]));

// Toaster:
import { Toaster } from "svelte-sonner";

// Components for all pages:
import Transition from "@/components/transition.svelte";
import Warning from "@/components/warning.svelte";

// Layout:
import Navbar from "@/components/navbar.svelte";

// State for visitor statistics
let visitorCount = '';
let loading = true;

onMount(async () => {
  if (typeof window !== 'undefined') {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  startAutoplay();

  // 动态加载 51LA SDK
  if (typeof window !== 'undefined' && PUBLIC_51LA_ID) {
    const script = document.createElement('script');
    script.charset = 'UTF-8';
    script.id = 'LA_COLLECT';
    script.src = '//sdk.51.la/js-sdk-pro.min.js';
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore - 51LA SDK 会在 window 上添加 LA 对象
      const LA = window.LA || {};
      if (LA.init) {
        LA.init({ id: PUBLIC_51LA_ID, ck: PUBLIC_51LA_ID });
      }
    };
  }

  try {
    if (!PUBLIC_51LA_ID) {
      loading = false;
      return;
    }
    const response = await fetch(`https://v6-widget.51.la/v6/${PUBLIC_51LA_ID}/quote.js`);
    const responseText = await response.text();
    const num = responseText.match(/(?<=<\/span><span>).*?(?=<\/span><\/p>)/g);
    if (num && num[6]) {
      visitorCount = (parseInt(num[6], 10) + 7500).toString();
    }
  } catch (error) {
    console.error('Failed to fetch visitor count:', error);
  } finally {
    loading = false;
  }
});

onDestroy(() => {
  stopAutoplay();
});

$: isLandingHome = data.pathname === '/';
  $: isAboutPage = data.pathname === '/about';
  $: isErrorPage = !!$page.error;
</script>

<ModeWatcher />

{#if isLandingHome || isAboutPage || isErrorPage}
  <!-- Homepage & About: uses its own full layout with navbar, hero, sidebar+cards -->
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
{:else}
  <!-- Other pages: use the existing sidebar layout -->
  <Navbar currentPath={data.pathname} />
  <main>
    <aside
      class={cn(
        'z-50 w-full overflow-y-auto overflow-x-hidden',
        'dark:border-neutral-800 md:fixed md:left-0 md:h-full md:w-56',
        'bg-white dark:bg-neutral-900',
        'opacity-95 backdrop-blur-md',
        'border-r border-neutral-200 dark:border-neutral-800',
        'flex flex-col'
      )}
    >
      <div class="flex h-full flex-col md:px-3 md:py-6">
        <nav
          class="flex flex-1 items-center space-x-1 overflow-y-auto px-6 pb-2 pt-2 md:mb-3 md:flex-col md:space-x-0 md:space-y-1 md:overflow-y-visible md:px-0 md:pt-0"
        >
          {#each [...categories].sort() as category}
            <a
              href={`/directory/${category.toLowerCase()}`}
              data-sveltekit-preload-data
              class={cn(
                sidebarItemStyles,
                data.pathname === `/directory/${category.toLowerCase()}`
                  ? 'bg-neutral-200 font-medium text-dark dark:bg-neutral-700/30 dark:text-white'
                  : ''
              )}
            >
              <span>{category}</span>
              <span
                class={cn(
                  sidebarCategoryCountStyles,
                  data.pathname === `/directory/${category.toLowerCase()}`
                    ? 'border-neutral-300 dark:border-neutral-700'
                    : '',
                  'hidden font-mono text-xs md:inline'
                )}
                >{categoryCounts[category]}</span
              >
            </a>
          {/each}
        </nav>
        <div class="mb-[30px] flex flex-col items-center gap-1.5 px-6 py-4 md:px-0">
          <div
            id="statistic"
            class={cn(
              sidebarItemStyles,
              'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200',
              'group transition-colors'
            )}
          >
            <div class="content">
              {#if loading}
                <div><span>加载中...</span></div>
              {:else if visitorCount}
                <div><span>网站总访问量: </span><span class="num">{visitorCount}</span></div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </aside>

    {#if showAdPopup}
      <div
        class="hidden md:block fixed bottom-12 left-4 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-[100]"
        role="banner"
        on:mouseenter={stopAutoplay}
        on:mouseleave={startAutoplay}
      >
        <button
          on:click={closeAdPopup}
          class="absolute top-2 right-2 p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full bg-white/80 dark:bg-neutral-800/80 z-10"
          aria-label="关闭广告"
        >
          <X size={10} class="text-neutral-600 dark:text-neutral-400" />
        </button>

        <div class="w-full relative">
          <div
            class="w-full transition-transform duration-300 ease-in-out"
            style="transform: translateX(-{currentBannerIndex * 100}%)"
          >
            <div class="flex">
              {#each banners as banner}
                <div class="w-full flex-shrink-0">
                  <a href={banner.link} target="_blank" rel="noopener noreferrer">
                    <img src={banner.imageUrl} alt={banner.alt} class="w-full h-auto" />
                  </a>
                </div>
              {/each}
            </div>
          </div>

          <div class="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {#each banners as banner, index}
              <button
                class={cn(
                  'w-1.5 h-1.5 rounded-full',
                  currentBannerIndex === index
                    ? 'bg-neutral-800 dark:bg-white'
                    : 'bg-neutral-300 dark:bg-neutral-600'
                )}
                on:click={() => (currentBannerIndex = index)}
                aria-label={`切换到第${index + 1}个广告`}
              ></button>
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <div class="ml-0 pb-6 md:ml-56">
      <Warning />
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
    </div>
  </main>
{/if}
