<script lang="ts">
  // 允许外部绑定获取 footer DOM 元素（用于 IntersectionObserver 等）
  export let element: HTMLElement;

  // 导入友链配置
  import { friendLinks } from '@/config/links';

  // 版权年份
  const currentYear = new Date().getFullYear();

  // 导航链接
  const navLinks = [
    { name: '首页', url: '/' },
    { name: '关于', url: '/about' },
    { name: '赞助支持', url: 'https://afdian.com/a/heyhuazi', external: true },
    { name: '交换友链', url: 'https://full-avatar-ae8.notion.site/33b8b338846a8042ab06dbd6add9fae6?pvs=105', external: true }
  ];
</script>

<footer bind:this={element} class="relative z-[60] bg-[#F0F0F0] dark:bg-neutral-900 border-t border-[#E5E5E580] dark:border-neutral-800 border-solid border-t-[1px]">
  <div class="max-w-[1280px] mx-auto px-[28px] py-[30px]">
    <div class="flex flex-col gap-6">
      <!-- 上半部分：logo + 描述 + 导航 -->
      <div class="flex flex-col md:flex-row justify-between gap-6">
        <!-- 左侧：logo + 描述 + 版权 -->
        <div class="flex flex-col gap-2">
          <!-- logo -->
          <div class="flex items-center gap-1.5 h-7">
            <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[26px] h-auto flex-shrink-0">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M227.907 54.231C231.347 55.583 235.412 54.869 238.193 52.087C241.936 48.345 241.936 42.276 238.193 38.533L217.47 17.807C213.728 14.064 207.66 14.064 203.918 17.807C201.148 20.578 200.428 24.622 201.758 28.054L181.281 37.492C178.021 38.994 175.768 42.073 175.321 45.634L171.544 75.772C171.366 77.19 173.083 78.03 174.093 77.019L191.834 59.276C191.681 58.704 191.6 58.102 191.6 57.482C191.6 53.657 194.7 50.556 198.524 50.556C202.349 50.556 205.449 53.657 205.449 57.482C205.449 61.307 202.349 64.408 198.524 64.408C197.904 64.408 197.303 64.326 196.731 64.173L179.035 81.872C178.021 82.885 178.871 84.608 180.292 84.419L210.23 80.455C213.724 79.992 216.744 77.79 218.253 74.605L227.907 54.231ZM233.297 47.19C232.259 48.229 230.575 48.229 229.537 47.19L208.814 26.464C207.776 25.426 207.776 23.743 208.814 22.704C209.852 21.666 211.535 21.666 212.574 22.704L233.297 43.43C234.335 44.469 234.335 46.152 233.297 47.19Z" fill="#06B30C" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M63.56 212.577C73.417 217.6 86.321 217.6 112.128 217.6H143.872C169.679 217.6 182.583 217.6 192.44 212.577C201.11 208.16 208.16 201.11 212.578 192.44C217.6 182.583 217.6 169.679 217.6 143.872V128V122.281C217.6 106.332 202.57 94.659 187.117 98.605C169.138 103.197 152.803 86.862 157.395 68.882C161.341 53.43 149.667 38.4 133.719 38.4L128 38.4L112.128 38.4C86.321 38.4 73.417 38.4 63.56 43.422C54.89 47.84 47.84 54.889 43.422 63.56C38.4 73.417 38.4 86.321 38.4 112.128L38.4 143.872C38.4 169.679 38.4 182.583 43.422 192.44C47.84 201.11 54.89 208.16 63.56 212.577ZM145.34 173.67C151.222 177.591 152.812 185.538 148.89 191.42C144.969 197.302 137.022 198.891 131.14 194.97L77.38 159.13C73.03 156.23 70.881 150.976 71.951 145.859C73.022 140.742 77.096 136.79 82.244 135.877L121.1 128.983L71.49 106.367C67.3 104.457 64.459 100.443 64.05 95.856C63.642 91.27 65.728 86.817 69.514 84.196L102.794 61.156C108.606 57.132 116.58 58.582 120.604 64.394C124.628 70.206 123.178 78.18 117.366 82.204L102.611 92.419L169.15 122.753C174.249 125.078 177.243 130.449 176.538 136.009C175.834 141.569 171.594 146.024 166.076 147.003L118.106 155.514L145.34 173.67Z" fill="#06B30C" />
            </svg>
            <span class="text-black dark:text-white font-bold text-sm leading-4 flex-shrink-0">SVGLOGO</span>
          </div>
          
          <!-- 描述 -->
          <p class="text-[#737373] dark:text-neutral-400 text-xs leading-[1.625] max-w-[384px] self-stretch">
            专注收录国内矢量 LOGO，为设计师和开发者提供高质量的品牌标识资源。
          </p>
          
          <!-- 版权信息 -->
          <div class="flex items-center gap-2">
            <span class="text-[#737373] dark:text-neutral-400 text-xs leading-[1.625]">© 2024-{currentYear} . </span>
            <div class="flex items-center gap-1 h-4">
              <span class="text-[#737373] dark:text-neutral-400 text-xs">由</span>
              <div class="flex items-center gap-1">
                <div class="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                  <img src="https://www.huazi.space/huazi.jpg" alt="Huazi" class="w-full h-full object-cover" />
                </div>
                <a href="https://huazi.space/" target="_blank" rel="noopener noreferrer" class="text-[#737373] dark:text-neutral-400 text-xs hover:text-black dark:hover:text-white transition-colors">Huazi</a>
              </div>
              <span class="text-[#737373] dark:text-neutral-400 text-xs">建造</span>
            </div>
          </div>
        </div>
        
        <!-- 右侧：导航 -->
        <div class="flex flex-col gap-2 w-[360px] justify-center items-start">
          <div class="flex items-center gap-1.5 h-7">
            <span class="text-black dark:text-white font-bold text-sm leading-4">导航</span>
          </div>
          <div class="flex gap-[14px] pt-0">
            {#each navLinks as link}
              <a
                href={link.url}
                target={link.external ? '_blank' : ''}
                rel={link.external ? 'noopener noreferrer' : ''}
                class="text-[#737373] dark:text-neutral-400 text-xs leading-[1.625] hover:text-black dark:hover:text-white transition-colors"
              >
                {link.name}
              </a>
            {/each}
          </div>
        </div>
      </div>

      <!-- 下半部分：友情链接 -->
      <div class="flex gap-3 justify-center flex-wrap">
        {#each friendLinks as link}
          <a href={link.url} target="_blank" rel="noopener noreferrer"
             class="text-[#3F3F3F] dark:text-neutral-400 text-[10px] leading-[1.625] hover:text-black dark:hover:text-white transition-colors">
            {link.name}
          </a>
        {/each}
      </div>
    </div>
  </div>
</footer>