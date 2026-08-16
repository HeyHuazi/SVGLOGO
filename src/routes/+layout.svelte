<script lang="ts">
  /**
   * [INPUT]: 依赖 LayoutServerData、全局 CSS、主题状态、分类索引与页面过渡组件
   * [OUTPUT]: 对外提供站点根布局，装配主题、Toast、目录页侧栏与页面过渡
   * [POS]: routes 的全局外壳；新版首页/关于页/admin 自带布局，旧目录页临时保留侧栏壳
   * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
   */
  import type { LayoutServerData } from "./$types";
  export let data: LayoutServerData;

  import "../app.css";
  import { page } from "$app/stores";
  import { cn } from "@/utils/cn";
  import { categories as categoryIndex } from "@/data/categories";
  import { sidebarCategoryCountStyles, sidebarItemStyles } from "@/ui/styles";
  import { ModeWatcher, mode } from "mode-watcher";
  import { Toaster } from "svelte-sonner";
  import Navbar from "@/components/navbar.svelte";
  import Transition from "@/components/transition.svelte";
  import Warning from "@/components/warning.svelte";

  $: if (typeof document !== "undefined") {
    const themeColor = $mode === "dark" ? "#171717" : "#FAFAFA";
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", themeColor);
  }

  $: isStandalonePage =
    data.pathname === "/" ||
    data.pathname === "/about" ||
    data.pathname.startsWith("/admin") ||
    !!$page.error;
</script>

<ModeWatcher />

{#if isStandalonePage}
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
          toast:
            "group toast dark:group-[.toaster]:bg-neutral-900 group-[.toaster]:font-sans",
          description: "group-[.toast]:text-xs font-mono",
        },
      }}
    />
  </main>
{:else}
  <Navbar currentPath={data.pathname} />
  <main>
    <aside
      class={cn(
        "z-50 w-full overflow-y-auto overflow-x-hidden",
        "dark:border-neutral-800 md:fixed md:left-0 md:h-full md:w-56",
        "bg-white dark:bg-neutral-900",
        "opacity-95 backdrop-blur-md",
        "border-r border-neutral-200 dark:border-neutral-800",
        "flex flex-col",
      )}
    >
      <div class="flex h-full flex-col md:px-3 md:py-6">
        <nav
          class="flex flex-1 items-center space-x-1 overflow-y-auto px-6 pb-2 pt-2 md:mb-3 md:flex-col md:space-x-0 md:space-y-1 md:overflow-y-visible md:px-0 md:pt-0"
        >
          {#each categoryIndex as category}
            <a
              href={`/directory/${category.slug}`}
              data-sveltekit-preload-data
              class={cn(
                sidebarItemStyles,
                decodeURIComponent(data.pathname) === `/directory/${category.slug}`
                  ? "bg-neutral-200 font-medium text-dark dark:bg-neutral-700/30 dark:text-white"
                  : "",
              )}
            >
              <span>{category.name}</span>
              <span
                class={cn(
                  sidebarCategoryCountStyles,
                  decodeURIComponent(data.pathname) === `/directory/${category.slug}`
                    ? "border-neutral-300 dark:border-neutral-700"
                    : "",
                  "hidden font-mono text-xs md:inline",
                )}>{category.count}</span
              >
            </a>
          {/each}
        </nav>
      </div>
    </aside>

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
            toast:
              "group toast dark:group-[.toaster]:bg-neutral-900 group-[.toaster]:font-sans",
            description: "group-[.toast]:text-xs font-mono",
          },
        }}
      />
    </div>
  </main>
{/if}
