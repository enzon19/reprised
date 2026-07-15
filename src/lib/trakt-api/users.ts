import { generateExtendedQuery, TraktEndpoint, type ExtendedInfo } from '.';
import type * as types from './types';

type ExtendedInfoUserProfile = ExtendedInfo | 'vip';
export async function getUserProfile(
	slug: 'me' | string,
	accessToken: string,
	extended?: ExtendedInfoUserProfile | ExtendedInfoUserProfile[]
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
			extended: generateExtendedQuery(extended)
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

type ExtendedInfoUserSettings = ExtendedInfo | 'browsing';
export async function retrieveSettings(
	accessToken: string,
	extended?: ExtendedInfoUserSettings | ExtendedInfoUserSettings[]
) {
	const endpoint = new TraktEndpoint('/users/settings');

	const response = await endpoint.traktFetch(
		{
			method: 'GET'
		},
		undefined,
		{
			extended: generateExtendedQuery(extended)
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

export async function getStats(slug: 'me' | string, accessToken: string) {
	const endpoint = new TraktEndpoint('/users/{id}/stats');

	const response = await endpoint.traktFetch(
		{
			method: 'GET'
		},
		{
			id: slug
		},
		undefined,
		accessToken
	);

	const responseAsJSON = await response.json();
	if (response.ok) {
		return responseAsJSON as types.GetUsersStatsResponse200;
	} else {
		throw responseAsJSON as Record<any, any>;
	}
}
