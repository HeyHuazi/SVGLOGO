<!--
  [INPUT]: 依赖 lucide-svelte 图标，$app/environment 的 browser，@/ui/styles 的 button 样式，@/utils/cn 的 className 合并
  [OUTPUT]: 对外提供 Warning 布局警告组件
  [POS]: 旧布局警告横幅，由 +layout.svelte 触达
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { AlertTriangleIcon, Check } from 'lucide-svelte';
  import { browser } from '$app/environment';
  import { buttonStyles } from '@/ui/styles';
  import { cn } from '@/utils/cn';

  let warning = false;
  const initialValue = browser ? window.localStorage.getItem('warning') : true;
</script>

{#if !warning && !initialValue}
  <div
    class="flex items-center w-full justify-between md:flex-row flex-col md:space-x-2 space-x-0 space-y-2 md:space-y-0 py-2 px-3 bg-neutral-100 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300"
  >
    <div class="flex items-center space-x-2">
      <AlertTriangleIcon size={18} strokeWidth={2} class="mr-1" />
      <p>
        本网站展示的矢量图形均为网络搜集、整理，仅供学习参考，不保证其权威性、准确性。其版权均严格归属于各自对应公司机构。<strong
          >严禁未经授权的复制、修改、传播或商业使用。</strong>
          本网站无法对用户使用LOGO后的具体行为及其法律后果承担责任。
      </p>
    </div>
    <button
      class={cn(buttonStyles, 'h-10 text-sm')}
      on:click={() => {
        localStorage.setItem('warning', 'true');
        warning = true;
      }}
    >
      <Check size={14} strokeWidth={2} />
      <span>好</span>
    </button>
  </div>
{/if}
