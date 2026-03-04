import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  if (url.searchParams.get('view') === 'original') {
    throw redirect(308, '/explore');
  }

  return {};
};
