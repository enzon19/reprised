import { USER_AGENT, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';
import { PUBLIC_TRAKT_CLIENT_ID, PUBLIC_TRAKT_API_BASE_URL } from '$env/static/public';
import { Redis } from '@upstash/redis';

const redis = new Redis({
	url: UPSTASH_REDIS_REST_URL,
	token: UPSTASH_REDIS_REST_TOKEN
});

export class TraktEndpoint {
	#cacheID?: string;
	#cacheInterval: number; // segundos
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

		const cacheKey = [
			'v' + this.#cacheVersion,
			this.#cacheID,
			...Object.values(pathParams ?? {}),
			...Object.entries(queryParams ?? {}),
			...(userID ? [userID] : [])
		].join(':');
		console.log('get cache', cacheKey);
		const cache = redis.get(cacheKey);
		console.log('cache return', cache);

		if (cache) {
			return cache;
		} else {
			const response = await this.traktFetch(
				options,
				pathParams,
				queryParams,
				accessToken,
				extraHeaders
			);

			if (response.status == 200) {
				redis.set(cacheKey, await response.json(), { ex: this.#cacheInterval });
			}

			return response;
		}
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
			'v' + this.#cacheVersion,
			this.#cacheID,
			...Object.values(pathParams ?? {}),
			...Object.entries(queryParams ?? {}),
			...(userID ? [userID] : ['*'])
		].join(':');
		console.log('clear cache', cacheID);
	}
}
