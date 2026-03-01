<script lang="ts">
  export let currentPath: string;

  import { cn } from '@/utils/cn';
  import Logo from './logo.svelte';
  import Theme from './theme.svelte';

  import { ArrowUpRight, CloudyIcon } from 'lucide-svelte';
  import XIcon from './xIcon.svelte';
  import GithubIcon from './githubIcon.svelte';
  import HuaziLogo from './HuaziLogo.svelte';
  import Huazilogo from './HuaziLogo.svelte';

  const externalLinks = [
    // {
    //   name: '关于',
    //   url: '/api',
    //   icon: CloudyIcon,
    //   external: false,
    //   label: "Go to the SVGL's API section"
    // },
    {
      name: '关于',
      url: '/about',
      external: false,
      label: "关于本站"
    },
    // {
    //   name: 'Extensions',
    //   url: 'https://github.com/pheralb/svgl?tab=readme-ov-file#-extensions',
    //   icon: ArrowUpRight,
    //   external: true,
    //   label: "Go to the SVGL's extensions section"
    // },
    {
      name: '提交图标',
      url: 'https://tally.so/r/3qOv78',
      // url: 'https://i7kd0opf28.feishu.cn/share/base/form/shrcnb7jawVrJTZ335o2buBOvqg',
      icon: ArrowUpRight,
      external: true,
      label: "提交或者反馈你想要的图标"
    },
    {
      name: '',
      url: 'https://github.com/HeyHuazi/SVGLOGO',
      icon: GithubIcon,
      external: true,
      label: "github",
      isCustomIcon: true
    },
  ];
</script>

<nav
  class={cn(
    'dark:bg-neutral-900 bg-white',
    'w-full px-5 py-4 border-b border-neutral-200 dark:border-neutral-800',
    'sticky top-0 z-50',
    'backdrop-blur-md dark:bg-neutral-900/90 bg-white/90'
  )}
>
  <!-- Se le puso un aria-label al href="/" -->
  <div class="flex items-center justify-between mx-auto">
    <div class="flex items-center space-x-2">
      <a href="/" aria-label="Go to the SVGL v4.1 home page">
        <div class="flex items-center space-x-2 opacity-100 hover:opacity-80 transition-opacity">
          <svelte:component this={Logo} />
          <span class="text-[19px] font-medium tracking-wide hidden md:block">SVG-LOGO</span>
          <!-- <p class="text-neutral-400 hidden md:block font-mono">v4.2</p> -->
        </div>
      </a>
    </div>
    <div class="flex items-center space-x-0 md:space-x-7">
      <div
        class="flex items-center md:space-x-4 divide-x divide-neutral-300 dark:divide-neutral-700 whitespace-nowrap"
      >
        {#each externalLinks as link}
          {#if link.name === '提交图标'}
            <!-- Tally popup button for 提交图标 -->
            <button
              data-tally-open="3qOv78"
              data-tally-align-left="1"
              data-tally-hide-title="1"
              data-tally-overlay="1"
              data-tally-emoji-text="👋"
              data-tally-emoji-animation="tada"
              aria-label={link.label ?? link.name}
              class={cn(
                'flex items-center opacity-80 hover:opacity-100 transition-opacity text-[15px] pl-2 md:pl-3 group cursor-pointer'
              )}
            >
              <span class="hidden md:block">{link.name}</span>
              <svelte:component
                this={link.icon}
                size={16}
                {...(!link.isCustomIcon && { name: "External link", strokeWidth: 1.5 })}
                class="ml-1 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px] hidden md:block"
              />
            </button>
          {:else}
            <!-- Regular links -->
            <a
              href={link.url}
              target={link.external ? '_blank' : ''}
              aria-label={link.label ?? link.name}
              class={cn(
                'flex items-center opacity-80 hover:opacity-100 transition-opacity text-[15px] pl-2 md:pl-3 group',
                currentPath === link.url &&
                  'underline underline-offset-8 decoration-dotted decoration-neutral-500'
              )}
            >
              {#if !link.external}
                <svelte:component
                  this={link.icon}
                  size={16}
                  strokeWidth={1.5}
                  class="mr-2"
                  name={link.name}
                />
              {/if}
              <span class={cn('hidden md:block', !link.external && 'block')}>{link.name}</span>
              {#if link.external}
                <svelte:component
                  this={link.icon}
                  size={16}
                  name="External link"
                  strokeWidth={1.5}
                  class="ml-1 transition-transform duration-300 group-hover:-translate-y-[1px] group-hover:translate-x-[1px] hidden md:block"
                />
              {/if}
            </a>
          {/if}
        {/each}
      </div>
      <div class="flex items-center space-x-4">
        <!-- <a
          href="https://twitter.com/HeyHuazi"
          target="_blank"
          class="flex items-center space-x-1 opacity-80 hover:opacity-100 transition-opacity"
          title="Twitter"
        >
          <XIcon iconSize={16} />
        </a> -->
        <!-- <a
          href="https://svgl.app/git"
          target="_blank"
          class="flex items-center space-x-1 opacity-80 hover:opacity-100 transition-opacity"
          title="GitHub"
        >
          <GithubIcon iconSize={19} />
        </a> -->
        <a
          href="https://huazi.space/"
          target="_blank"
          class="flex items-center space-x-1 opacity-80 hover:opacity-100 transition-opacity"
          title="Huazi"
        >
          <Huazilogo iconSize={19} />
        </a>
        <Theme />
      </div>
    </div>
  </div>
</nav>
