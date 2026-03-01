<script lang="ts">
  import { cn } from '@/utils/cn';
  import { ArrowUpRight, Calendar, Clock, Tag } from 'lucide-svelte';
  import Container from '@/components/container.svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <title>博客 - SVGLOGO</title>
  <meta name="description" content="SVGLOGO博客，分享设计资源、技术教程和行业趋势" />
</svelte:head>

<Container>
  <div class="max-w-6xl mx-auto  py-12 lg:py-16">

    <!-- 页面标题 -->
    <div class="text-center mb-12 bg-white dark:bg-neutral-900 bg-[url('/images/hero-pattern_light.svg')] dark:bg-[url('/images/hero-pattern_dark.svg')]">
      <h1 class="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
        博客文章
      </h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
        分享设计资源、技术教程和行业趋势
      </p>
    </div>

    <!-- 博客文章列表 - 修改为响应式三列布局 -->
    <div class="py-6 px-4 sm:px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each data.posts as post}
        <article class="group h-full">
          <a 
            href="/blog/{post.slug}" 
            class="block h-full bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all duration-200 hover:shadow-lg flex flex-col overflow-hidden"
          >
            <!-- 添加封面图 -->
            {#if post.metadata?.cover}
              <div class="h-44 w-full overflow-hidden">
                <img 
                  src={post.metadata.cover} 
                  alt={post.title} 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            {/if}
            
            <div class="p-5 flex-grow flex flex-col">
              <!-- 文章标题 -->
              <h2 class="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors mb-3">
                {post.title}
              </h2>
              
              <!-- 文章描述 -->
              <p class="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                {post.description}
              </p>
              
              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 mb-4">
                {#each post.tags as tag}
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                    <Tag size={12} class="mr-1" />
                    {tag}
                  </span>
                {/each}
              </div>
              
              <!-- 元信息 -->
              <div class="flex items-center justify-between text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-auto">
                <div class="flex items-center">
                  <span class="flex items-center">
                    <Calendar size={14} class="mr-1.5" />
                    {new Date(post.date).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                
                <span class="flex items-center text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  查看详情
                  <ArrowUpRight size={14} class="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </a>
        </article>
      {/each}
    </div>
    
    <!-- 如果没有文章 -->
    {#if data.posts.length === 0}
      <div class="text-center py-12">
        <p class="text-neutral-500 dark:text-neutral-400">
          暂无博客文章
        </p>
      </div>
    {/if}
  </div>
</Container>

<!-- Footer - 保持全宽背景 -->
<footer class="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 mt-16">
    <div class="max-w-6xl mx-auto  py-12 lg:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- 品牌信息区域 -->
        <div class="lg:col-span-2 text-center lg:text-left">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">SVGLOGO</h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 max-w-md mx-auto lg:mx-0 whitespace-nowrap">
            专注收录国内矢量LOGO，为设计师和开发者提供高质量的品牌标识资源。
          </p>
          <div class="flex justify-center lg:justify-start space-x-4">
            <a href="https://github.com/HeyHuazi/SVGLOGO" target="_blank" rel="noopener noreferrer" 
               class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">
              <span class="sr-only">GitHub</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <!-- 友链区域 - 两列布局，中小屏幕居中 -->
        <div class="text-center lg:text-left">
          <h4 class="text-sm font-semibold text-neutral-900 dark:text-white mb-4">友链</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2 max-w-xs mx-auto lg:max-w-none lg:mx-0">
            <div class="space-y-2 text-sm">
              <div><a href="https://designstroll.space/" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">设计漫步</a></div>
              <div><a href="https://www.yanyi.pro/" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">言意</a></div>
              <div><a href="https://xiaobot.osguider.com/" target="_blank" rel="noopener noreferrer" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">小报童排行榜</a></div>
            </div>
            <div class="space-y-2 text-sm">
              <div><a href="https://osguider.com/blog/" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">开源服务指南</a></div>
              <div><a href="https://tagly.notion.site/" target="_blank" rel="noopener noreferrer" class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">全网漫游指南</a></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 版权信息 -->
      <div class="border-t border-neutral-200 dark:border-neutral-800 mt-8 lg:mt-12 pt-8 text-center">
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          © 2024-{currentYear} SVGLOGO. Made with ❤️ by 
          <a href="https://huazi.space/" target="_blank" rel="noopener noreferrer" class="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">@Huazi</a>
        </p>
      </div>
    </div>
  </footer>