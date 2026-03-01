import { Redis } from '@upstash/redis/cloudflare';  // 使用 cloudflare 变体以获得最佳兼容性
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL, SVGL_API_REQUESTS } from '$env/static/private';

// Cloudflare Workers 环境的 Redis 客户端配置
const redis = new Redis({
  url: UPSTASH_REDIS_URL,
  token: UPSTASH_REDIS_TOKEN,
  // Cloudflare Workers 特定的配置选项
  retry: {
    retries: 3,
    backoff: (retryCount) => Math.pow(2, retryCount) * 100  // 指数退避
  }
});

// 优化限流器配置，适应 Cloudflare Workers 的执行模型
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(Number(SVGL_API_REQUESTS), '60 s'),
  analytics: true,
  // 禁用分析以减少边缘计算的额外开销
  enableAnalytics: process.env.NODE_ENV === 'production'
});
