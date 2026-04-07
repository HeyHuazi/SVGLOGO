<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let searchTerm: string = '';
  export let totalCount: number = 0;
  export let opacity: number = 1;

  const dispatch = createEventDispatcher();

  let inputElement: HTMLInputElement;

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
</script>

<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto transition-opacity duration-150 ease-out" style:opacity>
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
      placeholder={`在 ${totalCount} 个标志中搜索`}
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
