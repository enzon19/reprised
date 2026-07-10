import { TraktEndpoint } from '.';
import type * as types from './types';
import { PUBLIC_BASE_URL, PUBLIC_TRAKT_CLIENT_ID } from '$env/static/public';
import { TRAKT_CLIENT_SECRET } from '$env/static/private';

/**
 * Exchange an OAuth authorization code or refresh token for an access token. Send the
 * appropriate token request body; returns token details on success or a `400` response
 * when the request cannot be processed.
 *
 * @summary Exchange a token
 * @throws FetchError<400, types.PostOauthTokenResponse400> 400
 */
export async function getTokens(
	token: string,
	grantType: 'refresh_token' | 'code' = 'refresh_token'
) {
	const endpoint = new TraktEndpoint('/oauth/token');

	const body = {
		client_id: PUBLIC_TRAKT_CLIENT_ID,
		client_secret: TRAKT_CLIENT_SECRET,
		redirect_uri: PUBLIC_BASE_URL + '/authorized',
		grant_type: grantType == 'code' ? 'authorization_code' : grantType,
		[grantType]: token
	};

	const response = await endpoint.traktFetch({
		method: 'POST',
		body: JSON.stringify(body)
	});

	const responseAsJSON = await response.json();
	if (response.ok) {
		return responseAsJSON as types.PostOauthTokenResponse200;
	} else {
		throw responseAsJSON as types.PostOauthTokenResponse400;
	}
}
