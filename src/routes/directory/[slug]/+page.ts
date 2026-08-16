/*
 * [INPUT]: 依赖路由 slug、生成 categories 索引与 SVG 数据
 * [OUTPUT]: 对外提供目录页分类名称和匹配 SVG 列表，非法 slug 返回 404
 * [POS]: routes/directory/[slug] 的数据加载器，以生成 slug 为唯一路由匹配依据
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { categories } from '@/data/categories';
import { svgs } from '@/data/svgs';

export const load = (({ params }) => {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) throw error(404, 'Not found');

  const svgsByCategory = svgs.filter((svg) => {
    const values = Array.isArray(svg.category) ? svg.category : [svg.category];
    return values.includes(category.slug as never);
  });
  if (!svgsByCategory.length) throw error(404, 'Not found');

  return { category: category.name, svgs: svgsByCategory };
}) satisfies PageLoad;
