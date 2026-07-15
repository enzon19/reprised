import { TraktEndpoint, type ExtendedInfo } from '.';
import type * as types from './types';

export async function getUserProfile(
	slug: 'me' | string,
	accessToken: string,
	extended?: ExtendedInfo | 'vip' | 'images,vip' | 'full,vip'
) {
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

export async function retrieveSettings(
	accessToken: string,
	extended?: ExtendedInfo
) {
	const endpoint = new TraktEndpoint('/users/settings');

	const response = await endpoint.traktFetch(
		{
			method: 'GET'
		},
		undefined,
		{
			extended
		},
		accessToken
	);

	const responseAsJSON = await response.json();
	if (response.ok) {
		return responseAsJSON as types.GetUsersSettingsResponse200;
	} else {
		throw responseAsJSON as Record<any, any>;
	}
}