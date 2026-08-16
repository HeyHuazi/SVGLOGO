<!--
  [INPUT]: 依赖 @/ui/styles 的 input 样式，lucide-svelte 图标
  [OUTPUT]: 对外提供 Search 搜索组件，接收 searchTerm/placeholder props
  [POS]: 旧目录页搜索，仅服务于 directory/[slug] 降级路由
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { inputStyles } from '@/ui/styles';
  import { Command, SearchIcon, X } from 'lucide-svelte';

  export let searchTerm: string;
  export let placeholder: string = '搜索...';
  export let clearSearch: () => void;

  let inputElement: HTMLInputElement;

  function focusInput(node: HTMLInputElement) {
    const handleKeydown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        node.focus();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return {
      destroy() {
        window.removeEventListener('keydown', handleKeydown);
      }
    };
  }
</script>

<div class="sticky top-[63px] z-50">
  <div class="relative w-full text-[16px]">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
      <div class="pointer-events-none">
        <SearchIcon size={20} strokeWidth={searchTerm ? 2.5 : 1.5} />
      </div>
    </div>
    <input
      type="text"
      {placeholder}
      aria-label="搜索 Logo"
      autocomplete="off"
      class={inputStyles}
      bind:value={searchTerm}
      on:input
      use:focusInput
      bind:this={inputElement}
    />
    {#if searchTerm.length > 0}
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <button
          type="button"
          class="focus:outline-none focus:ring-1 focus:ring-neutral-300"
          on:click={clearSearch}
          aria-label="清空搜索"
          title="清空搜索"
        >
          <X size={18} />
        </button>
      </div>
    {:else}
      <div class="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-500">
        <div class="flex h-full items-center pointer-events-none gap-x-1 font-mono">
          <Command size={16} />
          <span>K</span>
        </div>
      </div>
    {/if}
  </div>
</div>
