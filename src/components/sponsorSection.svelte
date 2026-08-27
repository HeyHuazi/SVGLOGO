<!--
  [INPUT]: 依赖 @/config/sponsors 的 sponsors 与 SPONSOR_PLAN（price 展示、donateUrl 爱发电跳转）；Logo 按 logoShapes 多形状（path/ellipse）渲染，viewBox 取 logoViewBox；品牌色经 CSS 变量 + .dark 作用域实现深浅色自适应（黑色品牌深色模式用 darkColor）
  [OUTPUT]: 对外提供 SponsorSection 首页赞助区域组件，展示赞助商卡片，占位卡直接跳转爱发电赞助地址
  [POS]: components 层的首页 Hero 下方赞助区块，被 +page.svelte 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { sponsors, SPONSOR_PLAN, type Sponsor } from '@/config/sponsors';

  // 网格 4 格，真实赞助商不足时用占位卡补齐
  const GRID_SLOTS = 4;
  const placeholderCount = Math.max(GRID_SLOTS - sponsors.length, 0);

  const donateUrl = SPONSOR_PLAN.donateUrl;

  /** 生成品牌卡主题 CSS 变量：浅色用 color，深色用 darkColor（缺省沿用 color）；底色 6% 透明度，描边浅色 50%、深色 20%（白色高透明在深底上视觉重量已足够） */
  function sponsorVars(sponsor: Sponsor): string {
    const dark = sponsor.darkColor ?? sponsor.color;
    return [
      `--sp: ${sponsor.color}`,
      `--sp-dark: ${dark}`,
      `--sp-bg: ${sponsor.color}0f`,
      `--sp-bg-dark: ${dark}0f`,
      `--sp-border: ${sponsor.color}80`,
      `--sp-border-dark: ${dark}33`
    ].join('; ');
  }
</script>

<section class="w-full bg-[#FAFAFA] pb-[30px] dark:bg-neutral-900">
  <div class="mx-auto flex w-full max-w-[1280px] flex-col items-center px-7">
    <div class="mb-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
      赞助商
    </div>

    <div class="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
      {#each sponsors as sponsor}
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          class="sponsor-card group relative flex min-h-[78px] flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-300 hover:scale-[1.02] sm:p-3.5"
          style={sponsorVars(sponsor)}
        >
          <span class="sponsor-name text-[13.5px] font-bold tracking-tight">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={sponsor.logoViewBox ?? '0 0 24 24'}
              role="img"
              aria-label={sponsor.name}
              class="mr-2 inline h-5 w-5 shrink-0"
            >
              {#each sponsor.logoShapes as shape}
                {#if shape.d}
                  <path d={shape.d} fill="currentColor" />
                {:else if shape.ellipse}
                  <ellipse
                    cx={shape.ellipse.cx}
                    cy={shape.ellipse.cy}
                    rx={shape.ellipse.rx}
                    ry={shape.ellipse.ry}
                    transform={shape.ellipse.transform}
                    fill="currentColor"
                  />
                {/if}
              {/each}
            </svg>
            {sponsor.name}
          </span>
          <p
            class="mt-1 w-full px-0.5 text-[10.5px] font-medium leading-[14px] text-neutral-500 line-clamp-2 sm:text-[11px] sm:leading-[15px]"
            title={sponsor.description}
          >
            {sponsor.description}
          </p>
        </a>
      {/each}

      {#each Array(placeholderCount) as _, i}
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="去爱发电赞助 SVGLOGO"
          class="group flex min-h-[78px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 p-3 text-center transition-all duration-300 hover:scale-[1.02] hover:border-neutral-400 hover:bg-neutral-50/30 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-800/30 sm:p-3.5"
        >
          <span class="flex items-center gap-1 text-[12px] font-bold tracking-tight text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300">
            <span>+</span> 成为赞助商
          </span>
          <span class="mt-1 text-[9.5px] text-neutral-500 transition-colors group-hover:text-neutral-600 dark:text-neutral-400 dark:group-hover:text-neutral-300">
            {SPONSOR_PLAN.price}
          </span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  /* 品牌卡浅色主题：底色/描边用品牌色透明度变体，文字用品牌色 */
  .sponsor-card {
    background: var(--sp-bg);
    border-color: var(--sp-border);
  }
  .sponsor-name {
    color: var(--sp);
  }

  /* 深色主题：切换到 darkColor（黑色品牌 → 白色），保证深色背景可读 */
  :global(.dark) .sponsor-card {
    background: var(--sp-bg-dark);
    border-color: var(--sp-border-dark);
  }
  :global(.dark) .sponsor-name {
    color: var(--sp-dark);
  }
</style>
