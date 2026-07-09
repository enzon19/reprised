import { USER_AGENT } from '$env/static/private';
import { PUBLIC_TRAKT_CLIENT_ID, PUBLIC_TRAKT_API_BASE_URL } from '$env/static/public';

export class TraktEndpoint {
	#cacheID?: string;
	#cacheInterval: number;
	#cacheVersion: number;
	#endpoint: string;

	constructor(endpoint: string, cacheID?: string, cacheInterval: number = -1, cacheVersion = 1) {
		this.#endpoint = endpoint;
		this.#cacheID = cacheID;
		this.#cacheInterval = cacheInterval;
		this.#cacheVersion = cacheVersion;
	}

	buildPath(template: string, params: Record<string, string | number>): string {
		return template.replace(/\{(\w+)\}/g, (match, key) => {
			if (!(key in params)) {
				throw new Error(`Missing param "${key}" for template "${template}"`);
			}
			return String(params[key]);
		});
	}

	traktFetch(
		options: RequestInit,
		pathParams?: Record<string, string | number>,
		queryParams?: Record<string, string | number | undefined>,
		accessToken?: string,
		extraHeaders?: Record<string, string>
	) {
		const finalOptions = {
			...options,
			headers: {
				'Content-Type': 'application/json',
				'trakt-api-version': '2',
				'trakt-api-key': PUBLIC_TRAKT_CLIENT_ID,
				'User-Agent': USER_AGENT,
				...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				...extraHeaders
			}
		};

		const path = pathParams ? this.buildPath(this.#endpoint, pathParams) : this.#endpoint;
		const url = new URL(PUBLIC_TRAKT_API_BASE_URL + path);

		if (queryParams) {
			for (const [key, value] of Object.entries(queryParams)) {
				if (value !== undefined) url.searchParams.set(key, String(value));
			}
		}

		return fetch(url, finalOptions);
	}

	async fetchFromCache(
		options: RequestInit,
		pathParams?: Record<string, string | number>,
		queryParams?: Record<string, string | number | undefined>,
		accessToken?: string,
		userID?: string,
		extraHeaders?: Record<string, string>
	) {
		if (!this.#cacheID || this.#cacheInterval <= -1)
			return await this.traktFetch(options, pathParams, queryParams, accessToken, extraHeaders);

		const cacheID = [
			this.#cacheID,
			...Object.values(pathParams ?? {}),
			...Object.entries(queryParams ?? {}),
			...(userID ? [userID] : [])
		].join(':');
		console.log('get cache', cacheID);
		// check if it's too old or the version is wrong. if so, traktFetch and new cache, if not return cache without _cache_version and _cache_last_updated
		return await this.traktFetch(options, pathParams, queryParams, accessToken, extraHeaders);
	}

	clearCache(
		pathParams?: Record<string, string | number>,
		queryParams?: Record<string, string | number | undefined>,
		accessToken?: string,
		userID?: string
	) {
		if (!this.#cacheID || this.#cacheInterval <= -1) {
			console.warn('Endpoint not cached:', this.#endpoint);
			return;
		}

		// search for every this.#cacheID
		const cacheID = [
			this.#cacheID,
			...Object.values(pathParams ?? {}),
			...Object.entries(queryParams ?? {}),
			...(userID ? [userID] : ['*'])
		].join(':');
		console.log('clear cache', cacheID);
	}
}
