<!--
  [INPUT]: 依赖 svelte 的自定义 transition/easing、lucide-svelte 的 Star 图标、githubIcon 的官方标识、@/utils/cn 的 className 合成
  [OUTPUT]: 对外提供 GithubStarButton 悬停星标切换按钮组件，接收 stars 与 className prop
  [POS]: components 层的 GitHub 星标按钮视图，被 navbar 桌面端消费，替代原静态 GitHub 链接
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { backOut, cubicOut } from 'svelte/easing';
  import { Star } from 'lucide-svelte';
  import GithubIcon from '@/components/githubIcon.svelte';
  import { cn } from '@/utils/cn';

  export let stars: number | null = null;
  export let className: string = '';

  let hovered = false;

  /* ============================================================
   * 动效降级：尊重系统级 prefers-reduced-motion
   * ============================================================ */
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
   * 图标交换过渡 —— 单函数统一入/出场
   * github 从上方进出，star 从下方进出；方向由 from 参数驱动
   * 一个参数吃掉两个分支：好坏品味之分界线
   * ============================================================ */
  const swap = (node: Element, { from }: { from: number }) => ({
    duration: reduce ? 0 : 260,
    easing: backOut,
    css: (t: number) =>
      `transform: translateY(${(1 - t) * from}px) scale(${0.8 + 0.2 * t}); opacity: ${t};`
  });

  /* 星角闪光：旋入 + 弹放 + 上浮，三位一体 */
  const sparkle = (node: Element) => ({
    duration: reduce ? 0 : 320,
    delay: 50,
    easing: cubicOut,
    css: (t: number) =>
      `transform: rotate(${(1 - t) * -45}deg) scale(${t}) translateY(${(1 - t) * 10}px); opacity: ${t};`
  });
</script>

<a
  href="https://github.com/HeyHuazi/SVGLOGO"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="GitHub Stars"
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
  on:focus={() => (hovered = true)}
  on:blur={() => (hovered = false)}
  class={cn(
    'flex items-center justify-center gap-1.5 h-8 px-3 rounded-[10px]',
    'bg-white dark:bg-neutral-800',
    'shadow-[#0A0A0B08_0px_-1px_0px_inset,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px,#0A0A0B1A_0px_0px_0px_0.5px]',
    'hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:scale-[1.02] active:scale-[0.96]',
    'transition-[color,background-color,transform] duration-150',
    className
  )}
>
  <!-- 图标舞台：两个图标绝对定位重叠，hover 时交叉飞换 -->
  <span class="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
    {#if hovered}
      <span
        class="absolute inset-0 flex items-center justify-center"
        in:swap={{ from: 15 }}
        out:swap={{ from: 15 }}
      >
        <Star size={16} class="text-yellow-400" strokeWidth={2.2} />
        <span class="absolute -top-3 -right-2 text-yellow-200" in:sparkle out:sparkle>
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z"
            />
          </svg>
        </span>
      </span>
    {:else}
      <span
        class="absolute inset-0 flex items-center justify-center"
        in:swap={{ from: -15 }}
        out:swap={{ from: -15 }}
      >
        <span class="text-black dark:text-neutral-400">
          <GithubIcon iconSize={16} />
        </span>
      </span>
    {/if}
  </span>

  {#if stars !== null}
    <span class="text-xs font-medium text-black dark:text-neutral-300">{stars}</span>
  {/if}
</a>
