import { isRedirect, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getTokens } from '$lib/trakt-api/auth';

export const load: PageServerLoad = async ({ url, cookies, parent }) => {
	const { user } = await parent();
	if (user) return redirect(303, '/');

	const code = url.searchParams.get('code');
	if (!code) return { error: 'Code not found' };

	try {
		const tokens = await getTokens(code, 'code');

		cookies.set('access_token', tokens.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		cookies.set('refresh_token', tokens.refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 365 // 1 year
		});

		return redirect(303, '/');
	} catch (e: any) {
		if (isRedirect(e)) throw e;
		return { error: e.error_description };
	}
};
