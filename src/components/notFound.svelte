<!--
  [INPUT]: 依赖 @/ui/styles 的 button 样式，lucide-svelte 图标
  [OUTPUT]: 对外提供 NotFound 无结果组件，接收 notFoundTerm prop
  [POS]: 旧目录页无结果反馈，仅服务于 directory/[slug] 降级路由
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { buttonStyles } from '@/ui/styles';
  export let notFoundTerm: string;
  import { PackageOpen, ArrowUpRight } from 'lucide-svelte';
</script>

<div class="mt-6 flex w-full flex-col items-center justify-center text-gray-600 dark:text-gray-400">
  <PackageOpen size={40} class="mb-4" />
  <p class="text-xl mb-1 font-medium">找不到图标</p>
  <p class="text-md mb-4 font-mono">"{notFoundTerm}"</p>
  <div class="flex items-center space-x-1">
    <a
      href="https://tally.so/r/3qOv78"
      target="_blank"
      class={buttonStyles}
    >
      <span>提交 Logo</span>
      <ArrowUpRight size={16} />
    </a>
    <!-- <a
      href="https://github.com/pheralb/svgl/issues/new?assignees=pheralb&labels=request&projects=&template=request-svg-.md&title=%5BRequest%5D%3A"
      target="_blank"
      class={buttonStyles}
    >
      <span>Request Icon</span>
      <ArrowUpRight size={16} />
    </a> -->
  </div>
</div>
