<!--
  [INPUT]: 依赖 svelte 的 onMount/createEventDispatcher
  [OUTPUT]: 对外提供 HomeSearch 首页搜索组件，派发 search/clear 事件
  [POS]: components 层的新版首页搜索，被 +page.svelte 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let searchTerm: string = '';
  export let totalCount: number = 0;
  export let opacity: number = 1;

  const dispatch = createEventDispatcher();

  let inputElement: HTMLInputElement;

  // 随机示例搜索词
  const exampleSearches = ['微信', '抖音', '百度', '支付宝', '淘宝', '小米', '华为', '美团', '京东', 'B站', 'QQ', '微博', '网易云音乐', '飞书', '钉钉'];
  let placeholderText = `在 ${totalCount} 个标志中搜索`;

  const handleInput = () => {
    dispatch('search', { value: searchTerm });
  };

  const handleKeydown = (event: KeyboardEvent) => {
    const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f';
    if (isShortcut) {
      event.preventDefault();
      inputElement?.focus();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  // 当 totalCount 变化时更新 placeholder
  $: placeholderText = `试试搜索: ${exampleSearches[Math.floor(Math.random() * exampleSearches.length)]}`;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto transition-opacity duration-150 ease-out" style:opacity>
  <div class="beam-wrapper" data-beam data-active>
    <div class="relative w-[527px] max-w-[calc(100vw-48px)]">
      <!-- Search icon -->
      <svg
        class="absolute left-[10px] top-1/2 -translate-y-1/2 w-3 h-3 text-[#8A8D8F] dark:text-neutral-500 peer-focus:text-[#06B30C] peer-focus:dark:text-[#06B30C] pointer-events-none flex-shrink-0 transition-colors"
        width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="7.652" y1="7.652" x2="10.75" y2="10.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="5" cy="5" r="3.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- Input -->
      <input
        type="text"
        placeholder={placeholderText}
        bind:value={searchTerm}
        on:input={handleInput}
        bind:this={inputElement}
        class="peer w-full py-[10px] bg-[#EFF0F0] dark:bg-neutral-800 border border-[#1C1F21]/10 dark:border-neutral-700/50 rounded-[10px] pl-[30px] pr-[30px] pt-[10px] text-sm font-medium text-neutral-800 dark:text-neutral-200 placeholder-[#8A8D8F] dark:placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#06B30C]/50 dark:focus:ring-[#06B30C]/50 focus:border-[#06B30C] dark:focus:border-[#06B30C] shadow-[0px_0.5px_0px_rgba(255,255,255,0.8)] transition-colors flex justify-center items-center"
        style="font-family: 'Geist', 'InterVariable', system-ui, sans-serif"
      />

      <!-- Shortcut keys -->
      {#if !searchTerm}
        <div class="absolute right-[7px] top-1/2 -translate-y-1/2 flex gap-[3px]">
          <div class="flex items-center justify-center w-5 h-5 rounded-[6px] bg-neutral-800/10 dark:bg-neutral-600/20">
            <span class="text-[10px] font-medium text-[#8A8D8F] dark:text-neutral-400" style="font-family: 'InterVariable', system-ui, sans-serif">⌘</span>
          </div>
          <div class="flex items-center justify-center w-5 h-5 rounded-[6px] bg-neutral-800/10 dark:bg-neutral-600/20">
            <span class="text-[10px] font-medium text-[#8A8D8F] dark:text-neutral-400" style="font-family: 'InterVariable', system-ui, sans-serif">F</span>
          </div>
        </div>
      {:else}
        <button
          on:click={() => {
            searchTerm = '';
            dispatch('search', { value: '' });
          }}
          class="absolute right-[7px] top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-[6px] bg-neutral-800/10 dark:bg-neutral-600/20 hover:bg-neutral-800/20 dark:hover:bg-neutral-600/30 transition-colors"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#8A8D8F] dark:text-neutral-400">
            <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .beam-wrapper {
    position: relative;
    border-radius: 12px;
    overflow: visible;
  }

  /* ── Spinning beam (outer glow border) ── */
  .beam-wrapper[data-active]::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 11px;
    padding: 2px;
    clip-path: inset(0 round 12px);
    background: conic-gradient(
        from var(--beam-angle),
        transparent 0%, transparent 54%,
        rgba(255, 255, 255, 0.1) 57%,
        rgba(255, 255, 255, 0.3) 60%,
        rgba(255, 255, 255, 0.6) 63%,
        rgba(255, 255, 255, 0.75) 66%,
        rgba(255, 255, 255, 0.6) 69%,
        rgba(255, 255, 255, 0.3) 72%,
        rgba(255, 255, 255, 0.1) 75%,
        transparent 78%, transparent 100%
      ),
      radial-gradient(ellipse 70px 40px at 33% -7.4%, rgb(255, 50, 100), transparent),
      radial-gradient(ellipse 60px 35px at 12% -5%, rgb(40, 140, 255), transparent),
      radial-gradient(ellipse 40px 70px at 2.1% 68.3%, rgb(50, 200, 80), transparent),
      radial-gradient(ellipse 20px 35px at 2.1% 68.3%, rgb(30, 185, 170), transparent),
      radial-gradient(ellipse 180px 32px at 74.4% 100%, rgb(100, 70, 255), transparent),
      radial-gradient(ellipse 85px 26px at 55% 100%, rgb(40, 140, 255), transparent),
      radial-gradient(ellipse 74px 32px at 93.9% 0%, rgb(255, 120, 40), transparent),
      radial-gradient(ellipse 26px 42px at 100% 27.1%, rgb(240, 50, 180), transparent),
      radial-gradient(ellipse 52px 48px at 100% 27.1%, rgb(180, 40, 240), transparent);
    -webkit-mask:
      conic-gradient(
        from var(--beam-angle),
        transparent 0%, transparent 30%,
        rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
        white 52%, white 80%,
        rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
        transparent 95%, transparent 100%
      ),
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: source-in, xor;
    mask:
      conic-gradient(
        from var(--beam-angle),
        transparent 0%, transparent 30%,
        rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
        white 52%, white 80%,
        rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
        transparent 95%, transparent 100%
      ),
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: intersect, exclude;
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    animation:
      beam-fade-in 0.6s ease forwards,
      beam-spin 2.5s linear infinite;
  }

  /* ── Inner color glow layer ── */
  .beam-wrapper[data-active]::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 11px;
    clip-path: inset(0 round 12px);
    background:
      radial-gradient(ellipse 63px 36px at 33% -7.4%, rgba(255, 50, 100, 0.35), transparent),
      radial-gradient(ellipse 54px 32px at 12% -5%, rgba(40, 140, 255, 0.35), transparent),
      radial-gradient(ellipse 36px 63px at 2.1% 68.3%, rgba(50, 200, 80, 0.35), transparent),
      radial-gradient(ellipse 18px 32px at 2.1% 68.3%, rgba(30, 185, 170, 0.35), transparent),
      radial-gradient(ellipse 162px 29px at 74.4% 100%, rgba(100, 70, 255, 0.35), transparent),
      radial-gradient(ellipse 77px 23px at 55% 100%, rgba(40, 140, 255, 0.35), transparent),
      radial-gradient(ellipse 67px 29px at 93.9% 0%, rgba(255, 120, 40, 0.35), transparent),
      radial-gradient(ellipse 23px 38px at 100% 27.1%, rgba(240, 50, 180, 0.35), transparent),
      radial-gradient(ellipse 47px 43px at 100% 27.1%, rgba(180, 40, 240, 0.35), transparent);
    box-shadow: inset 0 0 9px 1px rgba(255, 255, 255, 0.2);
    -webkit-mask-image:
      conic-gradient(
        from var(--beam-angle),
        transparent 0%, transparent 30%,
        rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
        white 52%, white 80%,
        rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
        transparent 95%, transparent 100%
      ),
      linear-gradient(white, transparent 22px, transparent calc(100% - 22px), white),
      linear-gradient(to right, white, transparent 22px, transparent calc(100% - 22px), white);
    -webkit-mask-composite: source-in, source-over;
    mask-image:
      conic-gradient(
        from var(--beam-angle),
        transparent 0%, transparent 30%,
        rgba(255, 255, 255, 0.1) 36%, rgba(255, 255, 255, 0.35) 44%,
        white 52%, white 80%,
        rgba(255, 255, 255, 0.35) 86%, rgba(255, 255, 255, 0.1) 92%,
        transparent 95%, transparent 100%
      ),
      linear-gradient(white, transparent 22px, transparent calc(100% - 22px), white),
      linear-gradient(to right, white, transparent 22px, transparent calc(100% - 22px), white);
    mask-composite: intersect, add;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    animation:
      beam-fade-in 0.6s ease forwards,
      beam-spin 2.5s linear infinite,
      beam-hue-shift 12s ease-in-out infinite;
  }

  /* ── Keyframes ── */
  @keyframes beam-spin {
    to { --beam-angle: 360deg; }
  }

  @keyframes beam-fade-in {
    to { opacity: 1; }
  }

  @keyframes beam-hue-shift {
    0%   { filter: hue-rotate(-30deg) brightness(1.20) saturate(1.20); }
    50%  { filter: hue-rotate(30deg) brightness(1.20) saturate(1.20); }
    100% { filter: hue-rotate(-30deg) brightness(1.20) saturate(1.20); }
  }

  /* ── Light mode: softer effect ── */
  :global(.dark) .beam-wrapper[data-active]::after {
    opacity: 0;
    animation:
      beam-fade-in 0.6s ease forwards,
      beam-spin 2.5s linear infinite;
  }

  :global(.dark) .beam-wrapper[data-active]::before {
    opacity: 0;
    animation:
      beam-fade-in 0.6s ease forwards,
      beam-spin 2.5s linear infinite,
      beam-hue-shift 12s ease-in-out infinite;
  }

  /* In light mode, reduce opacity so it's not overwhelming */
  :global(html:not(.dark)) .beam-wrapper[data-active]::after {
    opacity: 0;
    animation:
      beam-fade-in-light 0.6s ease forwards,
      beam-spin 2.5s linear infinite;
  }

  :global(html:not(.dark)) .beam-wrapper[data-active]::before {
    opacity: 0;
    animation:
      beam-fade-in-light 0.6s ease forwards,
      beam-spin 2.5s linear infinite,
      beam-hue-shift 12s ease-in-out infinite;
  }

  @keyframes beam-fade-in-light {
    to { opacity: 0.35; }
  }
</style>
