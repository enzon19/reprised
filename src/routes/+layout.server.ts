import { getTokens } from '$lib/trakt-api/auth';
import { retrieveSettings } from '$lib/trakt-api/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	try {
		if (!accessToken) throw new Error(); // try to force update

		const currentUserSettings = await retrieveSettings(accessToken, 'images'); // might have access_token, but maybe it's expired, throwing an error
		return currentUserSettings;
	} catch (e) {
		if (!refreshToken) return;

		try {
			const tokens = await getTokens(refreshToken, 'refresh_token');

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

			const currentUserSettings = await retrieveSettings(tokens.access_token, 'images'); // might have access_token, but maybe it's expired, throwing an error
			return currentUserSettings;
		} catch (refreshError) {
			console.error('Token refresh failed:', refreshError);
			cookies.delete('access_token', { path: '/' });
			cookies.delete('refresh_token', { path: '/' });
		}
	}
};
