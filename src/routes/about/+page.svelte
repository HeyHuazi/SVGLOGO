<script>
    import { cn } from '@/utils/cn';
    import { changelogData } from '@/data/changelog';
    import Navbar from '@/components/navbar.svelte';
    import Footer from '@/components/footer.svelte';
    import { afterNavigate } from '$app/navigation';
    import { tick } from 'svelte';
    import { browser } from '$app/environment';
    export let data;

    const scrollToHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          const navbarHeight = window.innerWidth >= 768 ? 80 : 64;
          const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };

    afterNavigate(async () => {
      if (!browser) return;
      await tick();
      scrollToHash();
      // Fallback for full page load where native hash scroll may interfere
      setTimeout(scrollToHash, 300);
    });
  </script>

  <svelte:head>
    <title>{data.meta.title}-SVGLOGO</title>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />
  </svelte:head>

  <!-- Navbar -->
  <Navbar currentPath="/about" />

  <section
    class="bg-white dark:bg-neutral-900 bg-[url('/images/hero-pattern_light.svg')] dark:bg-[url('/images/hero-pattern_dark.svg')]"
  >
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-20 z-10 relative">
      <div class="flex items-center space-x-4 text-center justify-center">
        <h1
          class="mb-4 text-4xl font-bold tracking-tight leading-none text-neutral-900 md:text-5xl lg:text-6xl dark:text-white"
        >
          关于本站
        </h1>
      </div>
      <p class="text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
        SVGLOGO 将专注于收录国内矢量 LOGO
      </p>
    </div>
  </section>

  <article
    class={cn(
      'prose dark:prose-invert',
      'mx-auto py-10 px-4 max-w-3xl',
      'prose-h2:font-medium',
      'prose-pre:m-0'
    )}
  >
    <svelte:component this={data.content} />
  </article>

  <!-- 更新日志模块 -->
  <section class="max-w-3xl mx-auto px-4 pb-16">
    <h2 class="text-2xl font-bold text-neutral-900 dark:text-white mb-8" id="更新日志">
      更新日志
    </h2>

    <div class="space-y-8">
      {#each changelogData as entry}
        <div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
            {entry.date}
          </h3>
          <div class="pl-4">
            <h4 class="text-base font-medium text-neutral-800 dark:text-neutral-200 mb-2">
              {#if entry.type === 'add'}✨ 增加图标
              {:else if entry.type === 'fix'}🐞 修复
              {:else if entry.type === 'announce'}📢 公告
              {:else}➖ 删除{/if}
            </h4>
            <p class="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {entry.description}
              {#if entry.contributor}
                <strong class="text-neutral-800 dark:text-neutral-200 ml-1">
                  {entry.contributor}
                </strong>
              {/if}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Footer -->
  <Footer />
