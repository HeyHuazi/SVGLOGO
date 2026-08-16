<!--
  [INPUT]: 依赖 mode-watcher 的 toggleMode/mode，lucide-svelte 图标
  [OUTPUT]: 对外提供 Theme 主题切换组件
  [POS]: components 层的主题切换入口，被 navbar 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { toggleMode, mode } from 'mode-watcher';

  // Icons:
  import { MoonIcon, SunIcon } from 'lucide-svelte';
</script>

<button on:click={toggleMode} aria-label="切换深色模式" class="opacity-80 hover:opacity-100">
  {#if $mode === 'light'}
    <SunIcon size={20} strokeWidth={1.5} />
  {:else}
    <MoonIcon size={20} strokeWidth={1.5} />
  {/if}
</button>
