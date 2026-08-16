# components/

> L2 | 父级: ../CLAUDE.md

成员清单
/_ 新版首页组件 _/
huaziLogo.svelte: Svelte 固定尺寸品牌标识组件，提供站点 Logo 图形
sponsorSection.svelte: Svelte 首页 Hero 下方赞助区域组件，数据驱动渲染赞助商卡片，虚线占位卡点击直接跳转爱发电赞助页（无弹窗）
emptyState.svelte: Svelte 新版首页空状态组件，承接搜索无结果反馈
footer.svelte: Svelte 新版页脚组件，展示版权、导航、友链与访问量
heroSection.svelte: Svelte 新版首页 Hero 组件，承载首屏品牌叙事，并通过共享资源解析选择亮色界面 Logo 流
homeSearch.svelte: Svelte 新版首页底部搜索组件，承接搜索输入与透明度控制
homeSidebar.svelte: Svelte 新版首页分类侧栏，消费生成分类索引并派发选择事件
navbar.svelte: Svelte 新版导航组件，承载主导航、GitHub、提交入口与主题切换，并仅在 SvelteKit 开发环境向桌面和移动菜单暴露 `/admin` 后台入口
/_ 共享核心组件 _/
githubStarButton.svelte: Svelte GitHub 星标按钮组件，悬停时图标飞换为星标并弹出角标闪光，复用真实 stars 数与导航按钮视觉语言，被 navbar 桌面端消费
copySvg.svelte: Svelte SVG 复制组件，通过共享资源解析选择当前主题对应的主 Logo 或 Wordmark 并写入剪贴板
download-assets.ts: TypeScript 下载视图模型，将主 Logo/Wordmark 与 single/light/dark 资源矩阵展开为统一可下载条目和当前主题预览
download-assets.test.ts: Vitest 下载视图模型测试，覆盖单一/主题主 Logo 与 Wordmark 的条目、文件名和预览选择
downloadSvg.svelte: Svelte 数据驱动下载组件，遍历统一资源组支持 SVG/PNG 与 light/dark ZIP 导出
svgCard.svelte: Svelte 核心 SVG 卡片组件，执行调用方分配的 eager/lazy 请求优先级，从 DOM `complete/naturalWidth` 恢复 hydration 与缓存命中的加载状态，通过共享解析函数选择当前主题主 Logo/Wordmark，并提供复制、下载、官网跳转与切换
transition.svelte: Svelte 页面过渡组件，包装路由切换动效
theme.svelte: Svelte 主题切换辅助组件，封装 mode-watcher 切换入口
/_ 图标组件 _/
githubIcon.svelte: Svelte GitHub 图标组件，提供矢量图标
logo.svelte: Svelte 站点 Logo 组件，服务导航和旧页面
xIcon.svelte: Svelte X 图标组件，提供社交或关闭类矢量图标
/_ 旧目录页组件 — 仅服务于 directory/[slug] 降级路由 _/
container.svelte: Svelte 旧目录页容器组件，约束内容宽度与页面边距
grid.svelte: Svelte 旧目录页网格容器，承接目录卡片排列
notFound.svelte: Svelte 旧目录页无结果组件
search.svelte: Svelte 旧目录页搜索组件
warning.svelte: Svelte 旧布局警告组件，由根 layout 外壳触达

法则: 成员完整·一行一文件·父级链接·技术词前置

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
