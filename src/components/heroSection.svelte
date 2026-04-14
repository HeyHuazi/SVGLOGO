<script lang="ts">
  import { svgs } from '@/data/svgs';
  import gitInfo from '@/config/git-info.json';

  const totalCount = svgs.length;

  // 固定取最新 20 个图标，无需 shuffle
  const latestLogos = svgs.slice(-20);
  const row1Logos = latestLogos.slice(0, 7);
  const row2Logos = latestLogos.slice(7, 13);
  const row3Logos = latestLogos.slice(13, 20);

  const getImagePath = (route: string | { light: string; dark: string }) => {
    if (typeof route === 'string') return route;
    return route.light || '/library/default.svg';
  };

  const lastUpdated = gitInfo.lastCommitDate;

  const handleImageError = (event: Event) => {
    const img = event.currentTarget as HTMLImageElement;
    img.style.display = 'none';
  };
</script>

<section class="w-full bg-[#FAFAFA] dark:bg-neutral-900 selection:bg-[#06B30C]/20 selection:text-[#06B30C]">
  <div class="max-w-[1280px] mx-auto px-7 pt-12 pb-12">
    <div class="flex flex-col lg:flex-row items-start gap-12 lg:gap-8">
      <!-- Left: Text Content -->
      <div class="flex-1 min-w-0 lg:max-w-[590px]">
        <div class="flex flex-col gap-2.5">
          <span class="text-[#06B30C] dark:text-green-500 text-base font-medium mb-1">
            {totalCount}+ 矢量标志
          </span>
          <h1 class="text-[60px] font-bold leading-none text-black dark:text-white tracking-tight">
            国内矢量标志收录
          </h1>
          <p class="text-black/50 dark:text-neutral-400 text-base leading-relaxed mt-2 max-w-[590px]">
            专注收录国内矢量 LOGO，免费在线下载矢量 LOGO 素材，为设计师和开发者提供高质量的品牌标识资源。
          </p>
        </div>

        <!-- Stats row -->
        <div class="flex items-center gap-8 mt-12">
          <div>
            <div class="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wide">
              可下载/复制格式：
            </div>
            <div class="flex items-center gap-4 mt-3">
              <div class="text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM0 14.841a1.13 1.13 0 0 0 .401.823c.13.108.288.192.478.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1 1 0 0 0-.375-.357 2.027 2.027 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.625.625 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.776.15-.225.099-.4.24-.528.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.559.559 0 0 1-.256.193c-.111.047-.249.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.248-.115.578.578 0 0 1-.255-.384H0Zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917l1.339 4Zm5.483-3.293c.076.152.123.316.14.492h-.776a.797.797 0 0 0-.096-.249.689.689 0 0 0-.17-.19.707.707 0 0 0-.237-.126.963.963 0 0 0-.3-.044c-.284 0-.506.1-.664.302-.157.2-.235.484-.235.85v.497c0 .235.033.44.097.616a.881.881 0 0 0 .305.413.87.87 0 0 0 .518.146.965.965 0 0 0 .457-.097.67.67 0 0 0 .273-.263c.06-.11.09-.23.09-.364v-.254h-.823v-.59h1.576v.798c0 .193-.032.377-.096.55a1.29 1.29 0 0 1-.293.457 1.37 1.37 0 0 1-.495.314c-.198.074-.43.111-.698.111a1.98 1.98 0 0 1-.752-.132 1.447 1.447 0 0 1-.534-.377 1.58 1.58 0 0 1-.319-.58 2.482 2.482 0 0 1-.105-.745v-.507c0-.36.066-.677.199-.949.134-.271.329-.482.583-.633.256-.152.564-.228.926-.228.238 0 .45.033.635.1.188.066.348.158.48.275.134.117.238.253.314.407Z" fill="currentColor" /></svg>
              </div>
              <div class="text-black dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-3.76 8.132c.076.153.123.317.14.492h-.776a.797.797 0 0 0-.097-.249.689.689 0 0 0-.17-.19.707.707 0 0 0-.237-.126.96.96 0 0 0-.299-.044c-.285 0-.506.1-.665.302-.156.201-.234.484-.234.85v.498c0 .234.032.439.097.615a.881.881 0 0 0 .304.413.87.87 0 0 0 .519.146.967.967 0 0 0 .457-.096.67.67 0 0 0 .272-.264c.06-.11.091-.23.091-.363v-.255H8.82v-.59h1.576v.798c0 .193-.032.377-.097.55a1.29 1.29 0 0 1-.293.458 1.37 1.37 0 0 1-.495.313c-.197.074-.43.111-.697.111a1.98 1.98 0 0 1-.753-.132 1.447 1.447 0 0 1-.533-.377 1.58 1.58 0 0 1-.32-.58 2.482 2.482 0 0 1-.105-.745v-.506c0-.362.067-.678.2-.95.134-.271.328-.482.582-.633.256-.152.565-.228.926-.228.238 0 .45.033.636.1.187.066.348.158.48.275.133.117.238.253.314.407Zm-8.64-.706H0v4h.791v-1.343h.803c.287 0 .531-.057.732-.172.203-.118.358-.276.463-.475a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.475-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.381.574.574 0 0 1-.238.24.794.794 0 0 1-.375.082H.788v-1.406h.66c.218 0 .389.06.512.182.123.12.185.295.185.521Zm1.964 2.666V13.25h.032l1.761 2.675h.656v-3.999h-.75v2.66h-.032l-1.752-2.66h-.662v4h.747Z" fill="currentColor" /></svg>
              </div>
            </div>
          </div>
          <div class="w-px self-stretch bg-neutral-200 dark:bg-neutral-700"></div>
          <div>
            <div class="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-wide">上次更新时间:</div>
            <a href="/about#更新日志" on:click|preventDefault={() => { window.location.href = '/about#更新日志'; }} class="group/date inline-flex items-center gap-1.5 text-black dark:text-white text-base mt-3 hover:text-[#06B30C] dark:hover:text-green-500 transition-colors duration-150">
              <span>{lastUpdated}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" class="transition-transform duration-150 group-hover/date:translate-x-0.5">
                <polyline points="6.5 2.75 12.75 9 6.5 15.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Right: Infinite Carousel Logo Grid -->
      <div class="hidden lg:block flex-shrink-0 w-[585px]">
        <div class="relative overflow-hidden h-[271px] rounded-xl">
          <!-- Row 1: scroll right (slow) -->
            <div class="flex gap-3 absolute animate-carousel-right" style="top: 0; animation-duration: 40s;">
              {#each [...row1Logos, ...row1Logos] as svg}
                <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <img src={getImagePath(svg.route)} alt={svg.title} class="w-8 h-8 object-contain" loading="lazy" fetchpriority="low" decoding="async" on:error={handleImageError} />
                </div>
              {/each}
            </div>

            <!-- Row 2: scroll left (faster, 6 items) -->
            <div class="flex gap-3 absolute animate-carousel-left" style="top: 92px; animation-duration: 30s;">
              {#each [...row2Logos, ...row2Logos] as svg}
                <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <img src={getImagePath(svg.route)} alt={svg.title} class="w-8 h-8 object-contain" loading="lazy" fetchpriority="low" decoding="async" on:error={handleImageError} />
                </div>
              {/each}
            </div>

            <!-- Row 3: scroll right (medium) -->
            <div class="flex gap-3 absolute animate-carousel-right" style="top: 184px; animation-duration: 35s;">
              {#each [...row3Logos, ...row3Logos] as svg}
                <div class="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <img src={getImagePath(svg.route)} alt={svg.title} class="w-8 h-8 object-contain" loading="lazy" fetchpriority="low" decoding="async" on:error={handleImageError} />
                </div>
              {/each}
            </div>

          <!-- Left gradient fade -->
          <div class="absolute left-0 top-0 w-[30px] h-full bg-gradient-to-r from-[#FAFAFA] dark:from-neutral-900 to-transparent z-10 pointer-events-none"></div>
          <!-- Right gradient fade -->
          <div class="absolute right-0 top-0 w-[30px] h-full bg-gradient-to-l from-[#FAFAFA] dark:from-neutral-900 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @keyframes carousel-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  @keyframes carousel-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-carousel-right {
    animation: carousel-right linear infinite;
  }
  .animate-carousel-left {
    animation: carousel-left linear infinite;
  }
</style>
