<!--
  [INPUT]: 依赖 @/components 的 Container，lucide-svelte 图标
  [OUTPUT]: 对外提供旧目录页布局外壳，包含返回链接
  [POS]: routes/directory/[slug] 的布局层
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script>
  import Container from '@/components/container.svelte';
  import { ArrowLeft } from 'lucide-svelte';
</script>

<Container>
  <a href="/">
    <div
      class="flex items-center space-x-2 duration-100 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-white group md:mt-2"
    >
      <ArrowLeft size={20} class="group-hover:-translate-x-[2px] group-hover:duration-200" />
      <span>查看全部</span>
    </div>
  </a>
</Container>
<slot />
