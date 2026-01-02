import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// 使用 Cloudflare Workers 兼容的缓存策略
// 注意：Cloudflare Workers 每次请求可能重建上下文，
// 使用全局变量存储可以在单次请求生命周期内保持缓存
let cachedStars: string | null = null;
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

export const GET: RequestHandler = async () => {
  const now = Date.now();
  
  // 如果缓存有效，直接返回
  if (cachedStars && (now - lastFetch) < CACHE_DURATION) {
    return json({ stars: cachedStars });
  }

  try {
    const res = await fetch('https://api.github.com/repos/pheralb/svgl', {
      // Cloudflare Workers 需要额外的 headers 来避免 CORS 问题
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SVGL-App/Cloudflare'
      }
    });
    
    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }
    
    const response = await res.json();
    
    const starsFormated = response.stargazers_count > 1000
      ? `${(response.stargazers_count / 1000).toFixed(1)}K`
      : response.stargazers_count;
    
    // 更新缓存
    cachedStars = starsFormated;
    lastFetch = now;
    
    return json({ stars: starsFormated });
  } catch (error) {
    // 如果有缓存数据，返回缓存（即使过期也比失败好）
    if (cachedStars) {
      console.warn('GitHub API failed, returning stale cache');
      return json({ stars: cachedStars });
    }
    
    console.error('Failed to fetch GitHub stars:', error);
    return json({ error: 'Failed to fetch stars' }, { status: 500 });
  }
};
