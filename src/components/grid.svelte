<!--
  [INPUT]: 无外部依赖，纯网格容器
  [OUTPUT]: 对外提供 Grid 网格布局组件
  [POS]: 旧目录页网格容器，仅服务于 directory/[slug] 降级路由
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<div
  class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
>
  <slot />
</div>
