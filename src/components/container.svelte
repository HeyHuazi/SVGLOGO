<!--
  [INPUT]: 无外部依赖，纯布局容器
  [OUTPUT]: 对外提供 Container 布局容器组件
  [POS]: 旧目录页容器，仅服务于 directory/[slug] 降级路由
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<div class="container mx-auto px-6 pt-4 xl:px-4">
  <slot />
</div>
