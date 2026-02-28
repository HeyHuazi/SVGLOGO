// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { fetchGitHubStars } from '@/utils/getStarsRepository';

export const load = async ({ url: { pathname } }: Parameters<LayoutServerLoad>[0]) => {
  const stars = await fetchGitHubStars();
  return { pathname, stars };
};
