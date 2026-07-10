import { TraktEndpoint } from '.';
import type * as types from './types';

export async function getUserProfile(slug: 'me' | string, accessToken: string, extended?: 'vip') {
	const endpoint = new TraktEndpoint('/users/{id}');

	const response = await endpoint.traktFetch(
		{
			method: 'GET'
		},
		{
			id: slug
		},
		{
      extended
    },
		accessToken
	);

	const responseAsJSON = await response.json();
	if (response.ok) {
		return responseAsJSON as types.GetUsersProfileResponse200;
	} else {
		throw responseAsJSON as Record<any, any>;
	}
}
