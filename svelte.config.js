import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Extensions:
import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';

// Markdown config:
// Shiki highlighter 单例：构建期只初始化一次，避免每个代码块重建实例
let highlighterPromise;
const getSharedHighlighter = () =>
  (highlighterPromise ??= getHighlighter({
    themes: ['vitesse-dark'],
    langs: ['javascript', 'typescript', 'bash', 'json']
  }));

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await getSharedHighlighter();
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
      routes: {
        exclude: [
          '<build>',
          '<prerendered>',
          '/library/*',
          '/images/*',
          '/fonts/*',
          '/ads.txt',
          '/manifest.json',
          '/robots.txt',
          '/sitemap.xml'
        ]
      }
    }),
    alias: {
      '@': './src/*'
    }
  }
};

export default config;
