<!--
  [INPUT]: 依赖 svelte/transition 的 fly 动效
  [OUTPUT]: 对外提供 Transition 页面过渡组件，接收 pathname prop
  [POS]: components 层的路由切换动效，被 +layout.svelte 消费
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { fly } from 'svelte/transition';
  export let pathname: string = '';
</script>

{#key pathname}
  <div in:fly={{ x: 0, y: 23, duration: 450 }}>
    <slot />
  </div>
{/key}
