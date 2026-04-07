<script lang="ts">
  export let currentPath: string;

  import { onMount } from 'svelte';
  import { cn } from '@/utils/cn';
  import { toggleMode, mode } from 'mode-watcher';
  import { navLinkStyles, navCtaStyles } from '@/ui/styles';

  let stars: number | null = null;
  let menuOpen = false;

  const navLinks = [
    { name: '首页', url: '/', external: false },
    { name: '关于', url: '/about', external: false },
    { name: '赞助支持', url: 'https://afdian.com/a/heyhuazi', external: true },
  ];

  const closeMenu = () => { menuOpen = false; };

  onMount(async () => {
    try {
      const res = await fetch('https://api.github.com/repos/HeyHuazi/SVGLOGO');
      if (res.ok) {
        const data = await res.json();
        stars = data.stargazers_count;
      }
    } catch {}
  });
</script>

<nav
  class={cn(
    'w-full relative',
    'bg-[#FAFAFA] dark:bg-neutral-900',
    'sticky top-0 z-50',
    'backdrop-blur-md bg-[#FAFAFA]/95 dark:bg-neutral-900/95',
    menuOpen ? 'h-auto' : ''
  )}
>
  <!-- Main bar -->
  <div class="flex items-center justify-between w-full max-w-[1280px] mx-auto px-5 md:px-7 h-16 md:h-20">
    <!-- Left: Nav Links (desktop only) -->
    <div class="hidden md:flex items-center gap-4">
      {#each navLinks as link}
        <a
          href={link.url}
          target={link.external ? '_blank' : ''}
          rel={link.external ? 'noopener noreferrer' : ''}
          class={cn(
            navLinkStyles,
            currentPath === link.url && 'text-neutral-900 dark:text-white'
          )}
        >
          {link.name}
        </a>
      {/each}
    </div>

    <!-- Left on mobile / Center on desktop: Logo -->
    <a href="/" aria-label="返回 SVGLOGO 首页" class="flex-shrink-0 transition-transform duration-300 hover:rotate-[-8deg]" on:click={closeMenu}>
      <svg width="40" height="40" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" class="md:hidden">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M227.907 54.231C231.347 55.583 235.412 54.869 238.193 52.087C241.936 48.345 241.936 42.276 238.193 38.533L217.47 17.807C213.728 14.064 207.66 14.064 203.918 17.807C201.148 20.578 200.428 24.622 201.758 28.054L181.281 37.492C178.021 38.994 175.768 42.073 175.321 45.634L171.544 75.772C171.366 77.19 173.083 78.03 174.093 77.019L191.834 59.276C191.681 58.704 191.6 58.102 191.6 57.482C191.6 53.657 194.7 50.556 198.524 50.556C202.349 50.556 205.449 53.657 205.449 57.482C205.449 61.307 202.349 64.408 198.524 64.408C197.904 64.408 197.303 64.326 196.731 64.173L179.035 81.872C178.021 82.885 178.871 84.608 180.292 84.419L210.23 80.455C213.724 79.992 216.744 77.79 218.253 74.605L227.907 54.231ZM233.297 47.19C232.259 48.229 230.575 48.229 229.537 47.19L208.814 26.464C207.776 25.426 207.776 23.743 208.814 22.704C209.852 21.666 211.535 21.666 212.574 22.704L233.297 43.43C234.335 44.469 234.335 46.152 233.297 47.19Z" fill="#06B30C" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M63.56 212.577C73.417 217.6 86.321 217.6 112.128 217.6H143.872C169.679 217.6 182.583 217.6 192.44 212.577C201.11 208.16 208.16 201.11 212.578 192.44C217.6 182.583 217.6 169.679 217.6 143.872V128V122.281C217.6 106.332 202.57 94.659 187.117 98.605C169.138 103.197 152.803 86.862 157.395 68.882C161.341 53.43 149.667 38.4 133.719 38.4L128 38.4L112.128 38.4C86.321 38.4 73.417 38.4 63.56 43.422C54.89 47.84 47.84 54.889 43.422 63.56C38.4 73.417 38.4 86.321 38.4 112.128L38.4 143.872C38.4 169.679 38.4 182.583 43.422 192.44C47.84 201.11 54.89 208.16 63.56 212.577ZM145.34 173.67C151.222 177.591 152.812 185.538 148.89 191.42C144.969 197.302 137.022 198.891 131.14 194.97L77.38 159.13C73.03 156.23 70.881 150.976 71.951 145.859C73.022 140.742 77.096 136.79 82.244 135.877L121.1 128.983L71.49 106.367C67.3 104.457 64.459 100.443 64.05 95.856C63.642 91.27 65.728 86.817 69.514 84.196L102.794 61.156C108.606 57.132 116.58 58.582 120.604 64.394C124.628 70.206 123.178 78.18 117.366 82.204L102.611 92.419L169.15 122.753C174.249 125.078 177.243 130.449 176.538 136.009C175.834 141.569 171.594 146.024 166.076 147.003L118.106 155.514L145.34 173.67Z" fill="#06B30C" />
      </svg>
      <svg width="46" height="46" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" class="hidden md:block">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M227.907 54.231C231.347 55.583 235.412 54.869 238.193 52.087C241.936 48.345 241.936 42.276 238.193 38.533L217.47 17.807C213.728 14.064 207.66 14.064 203.918 17.807C201.148 20.578 200.428 24.622 201.758 28.054L181.281 37.492C178.021 38.994 175.768 42.073 175.321 45.634L171.544 75.772C171.366 77.19 173.083 78.03 174.093 77.019L191.834 59.276C191.681 58.704 191.6 58.102 191.6 57.482C191.6 53.657 194.7 50.556 198.524 50.556C202.349 50.556 205.449 53.657 205.449 57.482C205.449 61.307 202.349 64.408 198.524 64.408C197.904 64.408 197.303 64.326 196.731 64.173L179.035 81.872C178.021 82.885 178.871 84.608 180.292 84.419L210.23 80.455C213.724 79.992 216.744 77.79 218.253 74.605L227.907 54.231ZM233.297 47.19C232.259 48.229 230.575 48.229 229.537 47.19L208.814 26.464C207.776 25.426 207.776 23.743 208.814 22.704C209.852 21.666 211.535 21.666 212.574 22.704L233.297 43.43C234.335 44.469 234.335 46.152 233.297 47.19Z" fill="#06B30C" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M63.56 212.577C73.417 217.6 86.321 217.6 112.128 217.6H143.872C169.679 217.6 182.583 217.6 192.44 212.577C201.11 208.16 208.16 201.11 212.578 192.44C217.6 182.583 217.6 169.679 217.6 143.872V128V122.281C217.6 106.332 202.57 94.659 187.117 98.605C169.138 103.197 152.803 86.862 157.395 68.882C161.341 53.43 149.667 38.4 133.719 38.4L128 38.4L112.128 38.4C86.321 38.4 73.417 38.4 63.56 43.422C54.89 47.84 47.84 54.889 43.422 63.56C38.4 73.417 38.4 86.321 38.4 112.128L38.4 143.872C38.4 169.679 38.4 182.583 43.422 192.44C47.84 201.11 54.89 208.16 63.56 212.577ZM145.34 173.67C151.222 177.591 152.812 185.538 148.89 191.42C144.969 197.302 137.022 198.891 131.14 194.97L77.38 159.13C73.03 156.23 70.881 150.976 71.951 145.859C73.022 140.742 77.096 136.79 82.244 135.877L121.1 128.983L71.49 106.367C67.3 104.457 64.459 100.443 64.05 95.856C63.642 91.27 65.728 86.817 69.514 84.196L102.794 61.156C108.606 57.132 116.58 58.582 120.604 64.394C124.628 70.206 123.178 78.18 117.366 82.204L102.611 92.419L169.15 122.753C174.249 125.078 177.243 130.449 176.538 136.009C175.834 141.569 171.594 146.024 166.076 147.003L118.106 155.514L145.34 173.67Z" fill="#06B30C" />
      </svg>
    </a>

    <!-- Right: Action Buttons -->
    <div class="flex items-center gap-2 md:gap-4">
      <!-- GitHub Button with Stars (desktop only) -->
      <a
        href="https://github.com/HeyHuazi/SVGLOGO"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Stars"
        class="hidden md:flex items-center justify-center gap-1.5 h-8 px-3 rounded-[10px] bg-white dark:bg-neutral-800 shadow-[#0A0A0B08_0px_-1px_0px_inset,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px,#0A0A0B1A_0px_0px_0px_0.5px] hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
      >
        <svg width="18" height="18" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
          <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" fill="#000000" class="dark:fill-neutral-400" />
        </svg>
        {#if stars !== null}
          <span class="text-xs font-medium text-black dark:text-neutral-300">{stars}</span>
        {/if}
      </a>

      <!-- Submit Icon Button (Green CTA) (desktop only) -->
      <button
        data-tally-open="3qOv78"
        data-tally-align-left="1"
        data-tally-hide-title="1"
        data-tally-overlay="1"
        aria-label="提交图标"
        class={cn(navCtaStyles, 'hidden md:flex')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" class="flex-shrink-0">
          <polyline points="7.25 5.75 10 3 12.75 5.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          <line x1="10" y1="13" x2="10" y2="3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          <path d="m6,9.07c-1.216.268-2.168,1.277-2.328,2.557l-.25,2c-.224,1.791,1.172,3.372,2.977,3.372h7.203c1.804,0,3.201-1.582,2.977-3.372l-.25-2c-.16-1.281-1.113-2.289-2.328-2.557" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
        </svg>
        <span>提交图标</span>
      </button>

      <!-- Theme Toggle (always visible) -->
      <button
        on:click={toggleMode}
        aria-label="切换深色模式"
        class="flex items-center justify-center w-8 h-8 rounded-[10px] bg-white dark:bg-neutral-800 shadow-[#0A0A0B08_0px_-1px_0px_inset,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px,#0A0A0B1A_0px_0px_0px_0.5px] hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
      >
        {#if $mode === 'light'}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#505355" class="dark:stroke-neutral-400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#505355" class="dark:stroke-neutral-400" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        {/if}
      </button>

      <!-- Hamburger Menu Button (mobile only) -->
      <button
        on:click={() => (menuOpen = !menuOpen)}
        aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
        class="md:hidden flex items-center justify-center w-8 h-8 rounded-[10px] bg-white dark:bg-neutral-800 shadow-[#0A0A0B08_0px_-1px_0px_inset,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px,#0A0A0B1A_0px_0px_0px_0.5px] hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
      >
        {#if menuOpen}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505355" class="dark:stroke-neutral-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#505355" class="dark:stroke-neutral-400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12h16"></path>
            <path d="M4 18h16"></path>
            <path d="M4 6h16"></path>
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile Menu Dropdown -->
  {#if menuOpen}
    <div class="md:hidden border-t border-neutral-200/50 dark:border-neutral-800">
      <div class="max-w-[1280px] mx-auto px-5 py-3 flex flex-col gap-1">
        <!-- Nav Links -->
        {#each navLinks as link}
          <a
            href={link.url}
            target={link.external ? '_blank' : ''}
            rel={link.external ? 'noopener noreferrer' : ''}
            on:click={closeMenu}
            class={cn(
              'flex items-center h-10 px-3 rounded-lg text-sm font-medium transition-colors duration-150',
              currentPath === link.url
                ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            )}
          >
            {link.name}
          </a>
        {/each}

        <!-- Divider -->
        <div class="h-px bg-neutral-200/50 dark:bg-neutral-800 my-1"></div>

        <!-- GitHub -->
        <a
          href="https://github.com/HeyHuazi/SVGLOGO"
          target="_blank"
          rel="noopener noreferrer"
          on:click={closeMenu}
          class="flex items-center h-10 px-3 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
            <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" fill="#000000" class="dark:fill-neutral-400" />
          </svg>
          <span>GitHub</span>
          {#if stars !== null}
            <span class="text-xs text-neutral-400 dark:text-neutral-500">· {stars} stars</span>
          {/if}
        </a>

        <!-- Submit -->
        <button
          data-tally-open="3qOv78"
          data-tally-align-left="1"
          data-tally-hide-title="1"
          data-tally-overlay="1"
          on:click={closeMenu}
          class="flex items-center h-10 px-3 rounded-lg text-sm font-medium text-[#01B30B] dark:text-[#01B30B] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" class="flex-shrink-0">
            <polyline points="7.25 5.75 10 3 12.75 5.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            <line x1="10" y1="13" x2="10" y2="3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            <path d="m6,9.07c-1.216.268-2.168,1.277-2.328,2.557l-.25,2c-.224,1.791,1.172,3.372,2.977,3.372h7.203c1.804,0,3.201-1.582,2.977-3.372l-.25-2c-.16-1.281-1.113-2.289-2.328-2.557" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
          <span>提交图标</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- Bottom gradient separator -->
  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[1280px] w-[calc(100%-56px)]">
    <div class="h-px bg-neutral-800/10 dark:bg-neutral-200/10"></div>
    <!-- Left fade -->
    <div class="absolute bottom-0 right-full w-12 h-px bg-gradient-to-r from-transparent to-neutral-800/10 dark:to-neutral-200/10"></div>
    <!-- Right fade -->
    <div class="absolute bottom-0 left-full w-12 h-px bg-gradient-to-l from-transparent to-neutral-800/10 dark:bg-neutral-200/10"></div>
  </div>
</nav>
