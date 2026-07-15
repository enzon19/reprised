import { getStats } from '$lib/trakt-api/users';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, cookies }) => {
	const { user } = await parent();
	const accessToken = cookies.get('access_token');
	if (!accessToken) return;

  const stats = await getStats('me', accessToken);

  return {stats};
}) satisfies PageServerLoad;
