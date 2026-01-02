import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Extensions:
import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';

// Markdown config:
/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await getHighlighter({
        themes: ['vitesse-dark'],
        langs: ['javascript', 'typescript', 'bash', 'json']
      });
      await highlighter.loadLanguage('javascript', 'typescript', 'bash');
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' }));
      return `{@html \`${html}\` }`;
    }
  }
};

// Svelte config:
/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter({
      // Cloudflare Pages 配置选项
      imageService: 'cloudflare', // 使用 Cloudflare 的图片优化服务
      routes: {
        exclude: ['/api/*', '/static/*'] // 排除这些路径让 Cloudflare 直接服务
      }
    }),
    alias: {
      '@': './src/*'
    }
  }
};

export default config;
