import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
	spec: Oas;
	core: APICore;

	constructor() {
		this.spec = Oas.init(definition);
		this.core = new APICore(this.spec, 'trakt-api/2.0.0 (api/6.1.3)');
	}

	/**
	 * Optionally configure various options that the SDK allows.
	 *
	 * @param config Object of supported SDK options and toggles.
	 * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
	 * should be represented in milliseconds.
	 */
	config(config: ConfigOptions) {
		this.core.setConfig(config);
	}

	/**
	 * If the API you're using requires authentication you can supply the required credentials
	 * through this method and the library will magically determine how they should be used
	 * within your API request.
	 *
	 * With the exception of OpenID and MutualTLS, it supports all forms of authentication
	 * supported by the OpenAPI specification.
	 *
	 * @example <caption>HTTP Basic auth</caption>
	 * sdk.auth('username', 'password');
	 *
	 * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
	 * sdk.auth('myBearerToken');
	 *
	 * @example <caption>API Keys</caption>
	 * sdk.auth('myApiKey');
	 *
	 * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
	 * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
	 * @param values Your auth credentials for the API; can specify up to two strings or numbers.
	 */
	auth(...values: string[] | number[]) {
		this.core.setAuth(...values);
		return this;
	}

	/**
	 * If the API you're using offers alternate server URLs, and server variables, you can tell
	 * the SDK which one to use with this method. To use it you can supply either one of the
	 * server URLs that are contained within the OpenAPI definition (along with any server
	 * variables), or you can pass it a fully qualified URL to use (that may or may not exist
	 * within the OpenAPI definition).
	 *
	 * @example <caption>Server URL with server variables</caption>
	 * sdk.server('https://{region}.api.example.com/{basePath}', {
	 *   name: 'eu',
	 *   basePath: 'v14',
	 * });
	 *
	 * @example <caption>Fully qualified server URL</caption>
	 * sdk.server('https://eu.api.example.com/v14');
	 *
	 * @param url Server URL
	 * @param variables An object of variables to replace into the server URL.
	 */
	server(url: string, variables = {}) {
		this.core.setServer(url, variables);
	}

	/**
	 * Construct then redirect to this URL. The Trakt website will request permissions for your
	 * app, which the user needs to approve. If the user isn't signed into Trakt, it will ask
	 * them to do so.
	 *
	 * > ### Important
	 * > _Use the website **https://trakt.tv** hostname when creating this URL and not the API
	 * URL._
	 *
	 * #### Optional URL Parameters
	 *
	 * When building the authorization URL, you can optionally include the following query
	 * parameters in the URL.
	 *
	 * | Parameter | Value | Description |
	 * |---|---|---|
	 * | `signup` | `true` | Prefer the account sign up page to be the default. |
	 * | `prompt` | `login` | Force the user to sign in and authorize your app. |
	 *
	 * @summary Authorize Application
	 */
	getOauthAuthorize(
		metadata?: types.GetOauthAuthorizeMetadataParam
	): Promise<FetchResponse<200, types.GetOauthAuthorizeResponse200>> {
		return this.core.fetch('/oauth/authorize', 'get', metadata);
	}

	/**
	 * Generate new codes to start the device authentication process. The `device_code` and
	 * `interval` will be used later to poll for the `access_token`. The `user_code` and
	 * `verification_url` should be presented to the user as mentioned in the flow steps above.
	 *
	 * #### QR Code
	 *
	 * You might consider generating a QR code for the user to easily scan on their mobile
	 * device. The QR code should be a URL that redirects to the `verification_url` and appends
	 * the `user_code`. For example, `https://trakt.tv/activate/5055CC52` would load the Trakt
	 * hosted `verification_url` and pre-fill in the `user_code`.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `client_id` * | string | Get this from your app settings. |
	 *
	 * @summary Generate new device codes
	 */
	postOauthDeviceCode(
		body: types.PostOauthDeviceCodeBodyParam
	): Promise<FetchResponse<200, types.PostOauthDeviceCodeResponse200>> {
		return this.core.fetch('/oauth/device/code', 'post', body);
	}

	/**
	 * Use the `device_code` and poll at the `interval` (in seconds) to check if the user has
	 * authorized you app. Use `expires_in` to stop polling after that many seconds, and
	 * gracefully instruct the user to restart the process. **It is important to poll at the
	 * correct interval and also stop polling when expired.**
	 *
	 * When you receive a `200` success response, save the `access_token` so your app can
	 * authenticate the user in methods that require it. The `access_token` is valid for **7
	 * days**. Save and use the `refresh_token` to get a new `access_token` without asking the
	 * user to re-authenticate. Check below for all the error codes that you should handle.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `code` * | string | `device_code` from the initial method. |
	 * | `client_id` * | string | Get this from your app settings. |
	 * | `client_secret` * | string | Get this from your app settings. |
	 *
	 * #### Status Codes
	 * This method will send various HTTP status codes that you should handle accordingly.
	 *
	 * | Code | Description |
	 * |---|---|
	 * | `200` | Success - *save the `access_token`*
	 * | `400` | Pending - *waiting for the user to authorize your app*
	 * | `404` | Not Found - *invalid `device_code`*
	 * | `409` | Already Used - *user already approved this code*
	 * | `410` | Expired - *the tokens have expired, restart the process*
	 * | `418` | Denied - *user explicitly denied this code*
	 * | `429` | Slow Down - *your app is polling too quickly*
	 *
	 * @summary Poll for the access_token
	 * @throws FetchError<400, types.PostOauthDeviceTokenResponse400> 400
	 */
	postOauthDeviceToken(
		body: types.PostOauthDeviceTokenBodyParam
	): Promise<FetchResponse<200, types.PostOauthDeviceTokenResponse200>> {
		return this.core.fetch('/oauth/device/token', 'post', body);
	}

	/**
	 * Exchange an OAuth authorization code or refresh token for an access token. Send the
	 * appropriate token request body; returns token details on success or a `400` response
	 * when the request cannot be processed.
	 *
	 * @summary Exchange a token
	 * @throws FetchError<400, types.PostOauthTokenResponse400> 400
	 */
	postOauthToken(
		body?: types.PostOauthTokenBodyParam
	): Promise<FetchResponse<200, types.PostOauthTokenResponse200>> {
		return this.core.fetch('/oauth/token', 'post', body);
	}

	/**
	 * An `access_token` can be revoked when a user signs out of their Trakt account in your
	 * app. This is not required, but might improve the user experience so the user doesn't
	 * have an unused app connection hanging around.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `token` * | string | A valid OAuth `access_token`. |
	 * | `client_id` * | string | Get this from your app settings. |
	 * | `client_secret` * | string | Get this from your app settings. |
	 *
	 * @summary Revoke an access_token
	 */
	postOauthRevoke(
		body: types.PostOauthRevokeBodyParam
	): Promise<FetchResponse<200, types.PostOauthRevokeResponse200>> {
		return this.core.fetch('/oauth/revoke', 'post', body);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns shows airing during the requested UTC date range. Use `target` to choose the
	 * authenticated user calendar (`my`) or the global calendar (`all`), and send `start_date`
	 * and `days` to define the window.
	 *
	 * @summary Get shows
	 */
	getCalendarsShows(
		metadata: types.GetCalendarsShowsMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsShowsResponse200>> {
		return this.core.fetch('/calendars/{target}/shows/{start_date}/{days}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns new shows airing their first season during the requested UTC date range. Use
	 * `target` to choose the authenticated user calendar (`my`) or the global calendar
	 * (`all`).
	 *
	 * @summary Get new shows
	 */
	getCalendarsNewShows(
		metadata: types.GetCalendarsNewShowsMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsNewShowsResponse200>> {
		return this.core.fetch('/calendars/{target}/shows/new/{start_date}/{days}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns season premieres airing during the requested UTC date range. Use `target` to
	 * choose the authenticated user calendar (`my`) or the global calendar (`all`).
	 *
	 * @summary Get season premieres
	 */
	getCalendarsSeasonPremieres(
		metadata: types.GetCalendarsSeasonPremieresMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsSeasonPremieresResponse200>> {
		return this.core.fetch(
			'/calendars/{target}/shows/premieres/{start_date}/{days}',
			'get',
			metadata
		);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns show finales airing during the requested UTC date range. Use `target` to choose
	 * the authenticated user calendar (`my`) or the global calendar (`all`).
	 *
	 * @summary Get finales
	 */
	getCalendarsFinales(
		metadata: types.GetCalendarsFinalesMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsFinalesResponse200>> {
		return this.core.fetch(
			'/calendars/{target}/shows/finales/{start_date}/{days}',
			'get',
			metadata
		);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns movies with a release date during the requested UTC date range. Use `target` to
	 * choose the authenticated user calendar (`my`) or the global calendar (`all`).
	 *
	 * @summary Get movies
	 */
	getCalendarsMovies(
		metadata: types.GetCalendarsMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsMoviesResponse200>> {
		return this.core.fetch('/calendars/{target}/movies/{start_date}/{days}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns all movies with a streaming release date during the requested UTC date range.
	 * Use `target` to choose the authenticated user calendar (`my`) or the global calendar
	 * (`all`).
	 *
	 * @summary Get streaming releases
	 */
	getCalendarsStreaming(
		metadata: types.GetCalendarsStreamingMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsStreamingResponse200>> {
		return this.core.fetch('/calendars/{target}/streaming/{start_date}/{days}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info 🎚 Filters
	 * Returns DVD and physical media releases during the requested UTC date range. Use
	 * `target` to choose the authenticated user calendar (`my`) or the global calendar
	 * (`all`).
	 *
	 * @summary Get DVD releases
	 */
	getCalendarsDvdReleases(
		metadata: types.GetCalendarsDvdReleasesMetadataParam
	): Promise<FetchResponse<200, types.GetCalendarsDvdReleasesResponse200>> {
		return this.core.fetch('/calendars/{target}/dvd/{start_date}/{days}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Check into a movie or episode. This should be tied to a user action to manually indicate
	 * they are watching something. The item will display as *watching* on the site, then
	 * automatically switch to *watched* status once the duration has elapsed. A unique history
	 * `id` (64-bit integer) will be returned and can be used to reference this checkin
	 * directly.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | item * | object | `movie` or `episode` object. (see examples ->) |
	 * | `sharing`  | object | Control sharing to any connected social networks. (see below
	 * &#8595;) |
	 * | `message`  | string | Message used for sharing. If not sent, it will use the watching
	 * string in the user settings. |
	 *
	 * #### Sharing
	 * The `sharing` object is optional and will apply the user's settings if not sent. If
	 * `sharing` is sent, each key will override the user's setting for that social network.
	 * Send `true` to post or `false` to not post on the indicated social network. You can see
	 * which social networks a user has connected with the
	 * [**\/users/settings**](/reference/users/settings) method.
	 *
	 * | Key | Type |
	 * |---|---|
	 * | `twitter` | boolean |
	 * | `mastodon` | boolean |
	 * | `tumblr` | boolean |
	 *
	 * > ### Note
	 * > _If a checkin is already in progress, a `409` HTTP status code will returned. The
	 * response will contain an `expires_at` timestamp which is when the user can check in
	 * again._
	 *
	 * @summary Check into an item
	 * @throws FetchError<409, types.PostCheckinStartResponse409> 409
	 */
	postCheckinStart(
		body?: types.PostCheckinStartBodyParam
	): Promise<FetchResponse<200, types.PostCheckinStartResponse200>> {
		return this.core.fetch('/checkin', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Removes any active checkins, no need to provide a specific item.
	 *
	 * @summary Delete any active checkins
	 */
	deleteCheckinDelete(): Promise<FetchResponse<204, types.DeleteCheckinDeleteResponse204>> {
		return this.core.fetch('/checkin', 'delete');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Get the user's settings so you can align your app's experience with what they're used to
	 * on the trakt website. A globally unique `uuid` is also returned, which can be used to
	 * identify the user locally in your app if needed. However, the `uuid` can't be used to
	 * retrieve data from the Trakt API.
	 *
	 * #### Limits
	 *
	 * The `limits` object is useful to customize your user experience. For example, if the
	 * user has a `list` limit of `2`, you might want to show a message to the user that they
	 * need to upgrade to [**Trakt VIP**](https://trakt.tv/vip) to add more lists.
	 *
	 * #### Permissions
	 *
	 * The `permissions` object is also useful to customize your user experience. In general,
	 * an account will have permissions to do everything. However, we'll temporarily set a
	 * permission to `false` if the user triggers spam protections.
	 *
	 * @summary Retrieve settings
	 */
	getUsersSettings(
		metadata?: types.GetUsersSettingsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSettingsResponse200>> {
		return this.core.fetch('/users/settings', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Update settings for the authenticated user. Send the settings request body with the
	 * values to change; a successful update returns no response body.
	 *
	 * @summary Update settings
	 */
	putUsersSaveSettings(
		body?: types.PutUsersSaveSettingsBodyParam
	): Promise<FetchResponse<201, types.PutUsersSaveSettingsResponse201>> {
		return this.core.fetch('/users/settings', 'put', body);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns comments the authenticated user has reacted to. Use `extended`, `page`, and
	 * `limit` to control returned comment detail and pagination.
	 *
	 * @summary Get comment reactions
	 */
	getUsersReactionsComments(
		metadata?: types.GetUsersReactionsCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersReactionsCommentsResponse200>> {
		return this.core.fetch('/users/reactions/comments', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns likes for a user filtered by type.
	 *
	 * @summary Get likes
	 */
	getUsersLikes(
		metadata: types.GetUsersLikesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersLikesResponse200>> {
		return this.core.fetch('/users/{id}/likes/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Update the authenticated user avatar. Send the avatar request body; a successful update
	 * returns a `204` response, and invalid image data returns `400`.
	 *
	 * @summary Update avatar
	 * @throws FetchError<400, types.PutUsersAvatarResponse400> 400
	 */
	putUsersAvatar(
		body: types.PutUsersAvatarBodyParam
	): Promise<FetchResponse<204, types.PutUsersAvatarResponse204>> {
		return this.core.fetch('/users/avatar', 'put', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Update the authenticated user cover image. Send the cover request body; a successful
	 * update returns a `204` response, and invalid image data returns `400`.
	 *
	 * @summary Update cover image
	 * @throws FetchError<400, types.PutUsersCoverResponse400> 400
	 */
	putUsersCover(
		body: types.PutUsersCoverBodyParam
	): Promise<FetchResponse<204, types.PutUsersCoverResponse204>> {
		return this.core.fetch('/users/set_cover', 'put', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns all users you have blocked, including when each user was blocked.
	 *
	 * @summary Get blocked users
	 */
	getUsersBlocked(): Promise<FetchResponse<200, types.GetUsersBlockedResponse200>> {
		return this.core.fetch('/users/blocked', 'get');
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination
	 * Paginated list of the authenticated user's data syncs across **every** connected app
	 * (younify, plex, importers). Counts only — the paused/skipped item arrays are served by
	 * the dedicated paginated endpoints.
	 *
	 * Pagination is via `page` / `limit` and the standard `X-Pagination-*` headers.
	 * `X-Pagination-Item-Count` is the total sync count (use it for the "Data has synced N
	 * times" banner). All timestamps are normalized to `.000Z`.
	 *
	 * @summary Get data syncs
	 */
	getUsersSyncsList(
		metadata?: types.GetUsersSyncsListMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSyncsListResponse200>> {
		return this.core.fetch('/users/syncs/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination
	 * Same as the list of data syncs, filtered by the app that created them. The `type`
	 * matches the `kind` returned on each row (`younify`, `plex`, or `import` for anything
	 * else, including `application_id 0` importers).
	 *
	 * An unknown `type` returns `404` rather than silently returning everything. Pagination
	 * and `X-Pagination-*` headers are identical to the unfiltered list.
	 *
	 * @summary Get data syncs by type
	 * @throws FetchError<404, types.GetUsersSyncsListByTypeResponse404> 404
	 */
	getUsersSyncsListByType(
		metadata: types.GetUsersSyncsListByTypeMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSyncsListByTypeResponse200>> {
		return this.core.fetch('/users/syncs/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns a single sync scoped to the authenticated user — foreign ids return `404`. Same
	 * shape as a list row: added counts plus `paused_count` / `skipped_count`, no item arrays.
	 *
	 * A numeric segment (`/users/syncs/157`) hits this endpoint; a non-numeric segment
	 * (`/users/syncs/younify`) is the filtered list.
	 *
	 * @summary Get a data sync
	 * @throws FetchError<404, types.GetUsersSyncsDetailsResponse404> 404
	 */
	getUsersSyncsDetails(
		metadata: types.GetUsersSyncsDetailsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSyncsDetailsResponse200>> {
		return this.core.fetch('/users/syncs/{id}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Undoes a sync — reverses every item it imported (history, ratings, paused, watchlist,
	 * collection) and marks it undone. Scoped to the authenticated user; a foreign sync
	 * returns `404`.
	 *
	 * @summary Undo a data sync
	 * @throws FetchError<404, types.DeleteUsersSyncsUndoResponse404> 404
	 */
	deleteUsersSyncsUndo(
		metadata: types.DeleteUsersSyncsUndoMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersSyncsUndoResponse204>> {
		return this.core.fetch('/users/syncs/{id}', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination
	 * Paginated item array for a sync, scoped to the authenticated user — foreign ids return
	 * `404`. Split out because a single sync can hold thousands of items.
	 *
	 * Paused items are always `history` (their `kind` is always `"history"`). Each item is the
	 * raw stored item (so source-specific fields are preserved) plus a normalized envelope,
	 * with timestamps normalized to `.000Z`. Pagination and `X-Pagination-*` headers are
	 * identical to the list endpoint.
	 *
	 * @summary Get paused sync items
	 * @throws FetchError<404, types.GetUsersSyncsPausedResponse404> 404
	 */
	getUsersSyncsPaused(
		metadata: types.GetUsersSyncsPausedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSyncsPausedResponse200>> {
		return this.core.fetch('/users/syncs/{id}/paused', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination
	 * Paginated item array for a sync, scoped to the authenticated user — foreign ids return
	 * `404`. Split out because a single sync can hold thousands of items.
	 *
	 * Skipped items mix `history` and `rating` (see each item's `kind` discriminator). Each
	 * item is the raw stored item (so source-specific fields are preserved) plus a normalized
	 * envelope, with timestamps normalized to `.000Z`. Pagination and `X-Pagination-*` headers
	 * are identical to the list endpoint.
	 *
	 * @summary Get skipped sync items
	 * @throws FetchError<404, types.GetUsersSyncsSkippedResponse404> 404
	 */
	getUsersSyncsSkipped(
		metadata: types.GetUsersSyncsSkippedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersSyncsSkippedResponse200>> {
		return this.core.fetch('/users/syncs/{id}/skipped', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the authenticated user's Plex connection status, real-time scrobbler webhook
	 * info, server/library/home-user selection, and both toggle sets (batch `sync` + real-time
	 * `scrobbler`). Read-only, though the VIP webhook URL lazily mints its tokens.
	 *
	 * `connection.connected` reflects that a Plex authorization exists; for a live auth check
	 * call `servers` and watch for a `bad_auth` error. `webhook.url` is null unless the user
	 * is VIP. `sync.configured` indicates the initial sync has been set up. Toggles are
	 * booleans (unset ⇒ `false`); sync toggles include `watching`/`watchlist`, scrobbler
	 * toggles do not carry `watchlist`. All timestamps are normalized to `.000Z`.
	 *
	 * @summary Get Plex settings
	 */
	getUsersPlexSettings(): Promise<FetchResponse<200, types.GetUsersPlexSettingsResponse200>> {
		return this.core.fetch('/users/settings/plex/', 'get');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Writes the Plex toggles, selection, and home users. Mirrors the GET shape so it
	 * round-trips; omitted toggle keys are left unchanged (no clobbering), and `library_ids`
	 * is sent structured and rebuilt into the `server|uuid` storage server-side.
	 *
	 * The optional `trigger_sync` block is the only thing that touches sync timestamps or
	 * enqueues work: any `*_all_data: true` resets the affected cursors and enqueues a full
	 * sync per selected server; present-but-all-false seeds every cursor to "now" (the first
	 * sync skips old history); absent writes settings without syncing.
	 *
	 * @summary Update Plex settings
	 */
	putUsersPlexUpdateSettings(
		body?: types.PutUsersPlexUpdateSettingsBodyParam
	): Promise<FetchResponse<204, types.PutUsersPlexUpdateSettingsResponse204>> {
		return this.core.fetch('/users/settings/plex/', 'put', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Mints a Plex web-auth URL for the client to open. Plex uses a 2-step PIN OAuth; the PIN
	 * is stashed server-side under an opaque `state` token and Plex is forwarded to a website
	 * return endpoint that exchanges it and redirects back to your `return_url` with
	 * `?plex_status=connected|error`.
	 *
	 * `return_url` is validated against the trakt-owned allowlist (`trakt://`,
	 * `http(s)://localhost`, `https://\*.trakt.tv`); a `400` is returned otherwise.
	 *
	 * @summary Connect Plex
	 * @throws FetchError<400, types.PostUsersPlexConnectResponse400> 400
	 */
	postUsersPlexConnect(
		body: types.PostUsersPlexConnectBodyParam
	): Promise<FetchResponse<200, types.PostUsersPlexConnectResponse200>> {
		return this.core.fetch('/users/settings/plex/connect', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Disconnects Plex: destroys the authorization, clears server/library/user selection and
	 * sync state, and busts the connection caches.
	 *
	 * @summary Disconnect Plex
	 */
	deleteUsersPlexDisconnect(): Promise<
		FetchResponse<204, types.DeleteUsersPlexDisconnectResponse204>
	> {
		return this.core.fetch('/users/settings/plex/connect', 'delete');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Lists the authenticated user's Plex servers. Network-bound — probes each server's remote
	 * URL. On a Plex/auth failure it returns the shared `{ error_code, message, guidance }`
	 * envelope: `bad_auth` (401), `plex_timeout` (504),
	 * `plex_bad_response`/`plex_generic_error` (502).
	 *
	 * @summary Get Plex servers
	 * @throws FetchError<401, types.GetUsersPlexServersResponse401> 401
	 * @throws FetchError<502, types.GetUsersPlexServersResponse502> 502
	 * @throws FetchError<504, types.GetUsersPlexServersResponse504> 504
	 */
	getUsersPlexServers(): Promise<FetchResponse<200, types.GetUsersPlexServersResponse200>> {
		return this.core.fetch('/users/settings/plex/servers', 'get');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the home accounts (owned servers only) and syncable libraries for a Plex server,
	 * with the user's current library selection flagged. Network-bound.
	 *
	 * Errors use the shared `{ error_code, message, guidance }` envelope:
	 * `missing_token`/`bad_auth` (401), `missing_server_id`/`plex_unprocessable` (422),
	 * `invalid_server_id`/`plex_not_found` (404), `invalid_server_url` (503), `plex_timeout`
	 * (504), `plex_bad_response`/`plex_generic_error` (502).
	 *
	 * @summary Get Plex server accounts and libraries
	 * @throws FetchError<401, types.GetUsersPlexServerAccountsResponse401> 401
	 * @throws FetchError<404, types.GetUsersPlexServerAccountsResponse404> 404
	 * @throws FetchError<422, types.GetUsersPlexServerAccountsResponse422> 422
	 * @throws FetchError<502, types.GetUsersPlexServerAccountsResponse502> 502
	 * @throws FetchError<503, types.GetUsersPlexServerAccountsResponse503> 503
	 * @throws FetchError<504, types.GetUsersPlexServerAccountsResponse504> 504
	 */
	getUsersPlexServerAccounts(
		metadata: types.GetUsersPlexServerAccountsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersPlexServerAccountsResponse200>> {
		return this.core.fetch('/users/settings/plex/servers/{server_id}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Enqueues a Plex sync immediately. With `server_id`, syncs that server; without it, syncs
	 * every server in the saved selection. `all_data: true` re-pulls full history, otherwise
	 * an incremental sync. A `422` is returned when there is no server to sync.
	 *
	 * @summary Sync Plex now
	 * @throws FetchError<422, types.PostUsersPlexSyncResponse422> 422
	 */
	postUsersPlexSync(
		body?: types.PostUsersPlexSyncBodyParam
	): Promise<FetchResponse<201, types.PostUsersPlexSyncResponse201>> {
		return this.core.fetch('/users/settings/plex/sync', 'post', body);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Get a user's profile information. If the user is private, info will only be returned if
	 * you send OAuth and are either that user or an approved follower. Adding `?extended=vip`
	 * will return some additional VIP related fields so you can display the user's Trakt VIP
	 * status and year count.
	 *
	 * @summary Get user profile
	 */
	getUsersProfile(
		metadata: types.GetUsersProfileMetadataParam
	): Promise<FetchResponse<200, types.GetUsersProfileResponse200>> {
		return this.core.fetch('/users/{id}/', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns recent activity for a user social graph. Use `type` to choose `friends`,
	 * `followers`, or `following`, and use pagination to move through the activity feed.
	 *
	 * @summary Get social activity
	 */
	getUsersActivities(
		metadata: types.GetUsersActivitiesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersActivitiesResponse200>> {
		return this.core.fetch('/users/{id}/{type}/activities', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional
	 * Returns stats about the movies, shows, and episodes a user has watched, collected, and
	 * rated.
	 *
	 * @summary Get stats
	 */
	getUsersStats(
		metadata: types.GetUsersStatsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersStatsResponse200>> {
		return this.core.fetch('/users/{id}/stats', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns the most recently written comments for the user. You can optionally filter by
	 * the `comment_type` and media `type` to limit what gets returned.
	 *
	 * By default, only top level comments are returned. Set `?include_replies=true` to return
	 * replies in addition to top level comments. Set `?include_replies=only` to return only
	 * replies and no top level comments.
	 *
	 * @summary Get comments
	 */
	getUsersComments(
		metadata: types.GetUsersCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersCommentsResponse200>> {
		return this.core.fetch('/users/{id}/comments/{comment_type}/{type}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns collection items for a user filtered by type.
	 *
	 * @summary Get collection
	 */
	getUsersCollection(
		metadata: types.GetUsersCollectionMetadataParam
	): Promise<FetchResponse<200, types.GetUsersCollectionResponse200>> {
		return this.core.fetch('/users/{id}/collection/{type}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 😁 Emojis
	 * Returns notes for a user filtered by type.
	 *
	 * @summary Get notes
	 */
	getUsersNotes(
		metadata: types.GetUsersNotesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersNotesResponse200>> {
		return this.core.fetch('/users/{id}/notes/{type}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns a movie or episode if the user is currently watching something.  If they are
	 * not, it returns no data and a `204` HTTP status code.
	 *
	 * @summary Get watching
	 */
	getUsersWatching(
		metadata: types.GetUsersWatchingMetadataParam
	): Promise<
		| FetchResponse<200, types.GetUsersWatchingResponse200>
		| FetchResponse<204, types.GetUsersWatchingResponse204>
	> {
		return this.core.fetch('/users/{id}/watching', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * If the user has a private profile, the follow request will require approval
	 * (`approved_at` will be null). If a user is public, they will be followed immediately
	 * (`approved_at` will have a date).
	 *
	 * > ### Note
	 * > _If this user is already being followed or there is a pending follow request, a `409`
	 * HTTP status code will returned._
	 *
	 * @summary Follow this user
	 * @throws FetchError<409, types.PostUsersFollowResponse409> 409
	 */
	postUsersFollow(
		metadata: types.PostUsersFollowMetadataParam
	): Promise<FetchResponse<201, types.PostUsersFollowResponse201>> {
		return this.core.fetch('/users/{id}/follow', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Unfollow someone you already follow.
	 *
	 * @summary Unfollow this user
	 */
	deleteUsersUnfollow(
		metadata: types.DeleteUsersUnfollowMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersUnfollowResponse204>> {
		return this.core.fetch('/users/{id}/follow', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Block a user. If they are already following you, they will be removed from your
	 * followers. Any pending follow request from this user will be blocked, preventing them
	 * from following you in the future until you unblock them.
	 *
	 * > ### Note
	 * > _If the user is already blocked, or you try to block yourself, a `409` HTTP status
	 * code will be returned._
	 *
	 * @summary Block this user
	 * @throws FetchError<409, types.PostUsersBlockResponse409> 409
	 */
	postUsersBlock(
		metadata: types.PostUsersBlockMetadataParam
	): Promise<FetchResponse<201, types.PostUsersBlockResponse201>> {
		return this.core.fetch('/users/{id}/block', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Unblock a user you previously blocked.
	 *
	 * @summary Unblock this user
	 */
	deleteUsersUnblock(
		metadata: types.DeleteUsersUnblockMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersUnblockResponse204>> {
		return this.core.fetch('/users/{id}/block', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a user for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per reported user.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `spam` | Spam account |
	 * | `adult` | Adult content in profile |
	 * | `language` | Not using English |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a user
	 * @throws FetchError<400, types.PostUsersReportResponse400> 400
	 * @throws FetchError<409, types.PostUsersReportResponse409> 409
	 */
	postUsersReport(
		body: types.PostUsersReportBodyParam,
		metadata: types.PostUsersReportMetadataParam
	): Promise<FetchResponse<201, types.PostUsersReportResponse201>> {
		return this.core.fetch('/users/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns all followers including when the relationship began.
	 *
	 * @summary Get followers
	 */
	getUsersFollowers(
		metadata: types.GetUsersFollowersMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFollowersResponse200>> {
		return this.core.fetch('/users/{id}/followers', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns all user's they follow including when the relationship began.
	 *
	 * @summary Get following
	 */
	getUsersFollowing(
		metadata: types.GetUsersFollowingMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFollowingResponse200>> {
		return this.core.fetch('/users/{id}/following', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns all friends for a user including when the relationship began. Friendship is a 2
	 * way relationship where each user follows the other.
	 *
	 * @summary Get friends
	 */
	getUsersFriends(
		metadata: types.GetUsersFriendsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFriendsResponse200>> {
		return this.core.fetch('/users/{id}/friends', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns a month-in-review summary for a user. Send the `year` and `month` path
	 * parameters to choose the review period.
	 *
	 * @summary Get month in review
	 */
	getUsersMonth_in_review(
		metadata: types.GetUsersMonthInReviewMetadataParam
	): Promise<FetchResponse<200, types.GetUsersMonthInReviewResponse200>> {
		return this.core.fetch('/users/{id}/mir/{year}/{month}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns a year-in-review summary for a user. Send the `year` path parameter to choose
	 * the review period.
	 *
	 * @summary Get year in review
	 */
	getUsersYear_in_review(
		metadata: types.GetUsersYearInReviewMetadataParam
	): Promise<FetchResponse<200, types.GetUsersYearInReviewResponse200>> {
		return this.core.fetch('/users/{id}/yir/{year}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns movies watched by a user in a minimal paginated format. Use `extended`, `page`,
	 * and `limit` to control the response.
	 *
	 * @summary Get watched movies
	 */
	getUsersWatchedMinimalMovies(
		metadata: types.GetUsersWatchedMinimalMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchedMinimalMoviesResponse200>> {
		return this.core.fetch('/users/{id}/watched/movies', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns shows watched by a user in a minimal paginated format. Use `specials` and
	 * `season_numbers` to control season details in the response.
	 *
	 * @summary Get watched shows
	 */
	getUsersWatchedMinimalShows(
		metadata: types.GetUsersWatchedMinimalShowsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchedMinimalShowsResponse200>> {
		return this.core.fetch('/users/{id}/watched/shows', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns all movies or shows a user has watched sorted by most recently watched.
	 *
	 * @summary Get watched
	 */
	getUsersWatchedTyped(
		metadata: types.GetUsersWatchedTypedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchedTypedResponse200>> {
		return this.core.fetch('/users/{id}/watched/{type}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns watched history for a user across all supported media types. Use `start_at` and
	 * `end_at` to limit results to a UTC datetime range.
	 *
	 * @summary Get watched history
	 */
	getUsersHistoryAll(
		metadata: types.GetUsersHistoryAllMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryAllResponse200>> {
		return this.core.fetch('/users/{id}/history/', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns movie watched history for a user. Use `start_at` and `end_at` to limit results
	 * to a UTC datetime range.
	 *
	 * @summary Get movie watched history
	 */
	getUsersHistoryMovies(
		metadata: types.GetUsersHistoryMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryMoviesResponse200>> {
		return this.core.fetch('/users/{id}/history/movies', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns show watched history for a user. Use `start_at` and `end_at` to limit results to
	 * a UTC datetime range.
	 *
	 * @summary Get show watched history
	 */
	getUsersHistoryShows(
		metadata: types.GetUsersHistoryShowsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryShowsResponse200>> {
		return this.core.fetch('/users/{id}/history/shows', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns episode watched history for a user. Use `start_at` and `end_at` to limit results
	 * to a UTC datetime range.
	 *
	 * @summary Get episode watched history
	 */
	getUsersHistoryEpisodes(
		metadata: types.GetUsersHistoryEpisodesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryEpisodesResponse200>> {
		return this.core.fetch('/users/{id}/history/episodes', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns watched history entries for one movie. Use `item_id` to identify the movie and
	 * `start_at` or `end_at` to limit the date range.
	 *
	 * @summary Get history for a movie
	 */
	getUsersHistoryMovie(
		metadata: types.GetUsersHistoryMovieMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryMovieResponse200>> {
		return this.core.fetch('/users/{id}/history/movies/{item_id}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns watched history entries for one show. Use `item_id` to identify the show and
	 * `start_at` or `end_at` to limit the date range.
	 *
	 * @summary Get history for a show
	 */
	getUsersHistoryShow(
		metadata: types.GetUsersHistoryShowMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryShowResponse200>> {
		return this.core.fetch('/users/{id}/history/shows/{item_id}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns watched history entries for one episode. Use `item_id` to identify the episode
	 * and `start_at` or `end_at` to limit the date range.
	 *
	 * @summary Get history for an episode
	 */
	getUsersHistoryEpisode(
		metadata: types.GetUsersHistoryEpisodeMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryEpisodeResponse200>> {
		return this.core.fetch('/users/{id}/history/episodes/{item_id}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
	 * Returns watched history entries for one item. Use `type`, `item_id`, `start_at`, and
	 * `end_at` to limit the result set.
	 *
	 * @summary Get watched history
	 */
	getUsersHistoryTypedItem(
		metadata: types.GetUsersHistoryTypedItemMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHistoryTypedItemResponse200>> {
		return this.core.fetch('/users/{id}/history/{type}/{item_id}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movies on a user watchlist. Use the `sort` path parameter plus query sorting,
	 * pagination, and filters to control the result order and contents.
	 *
	 * @summary Get movie watchlist
	 */
	getUsersWatchlistMovies(
		metadata: types.GetUsersWatchlistMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchlistMoviesResponse200>> {
		return this.core.fetch('/users/{id}/watchlist/movies/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns shows on a user watchlist. Use the `sort` path parameter plus query sorting,
	 * pagination, and filters to control the result order and contents.
	 *
	 * @summary Get show watchlist
	 */
	getUsersWatchlistShows(
		metadata: types.GetUsersWatchlistShowsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchlistShowsResponse200>> {
		return this.core.fetch('/users/{id}/watchlist/shows/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movies and shows on a user watchlist. Use the `sort` path parameter plus query
	 * sorting, pagination, and filters to control the result order and contents.
	 *
	 * @summary Get media watchlist
	 */
	getUsersWatchlistAll(
		metadata: types.GetUsersWatchlistAllMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchlistAllResponse200>> {
		return this.core.fetch('/users/{id}/watchlist/movie,show/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns all items in a user's watchlist filtered by type.
	 *
	 * @summary Get watchlist
	 */
	getUsersWatchlistTypedSorted(
		metadata: types.GetUsersWatchlistTypedSortedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchlistTypedSortedResponse200>> {
		return this.core.fetch('/users/{id}/watchlist/{type}/{sort_by}/{sort_how}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for the watchlist. By default, the comments are sorted by
	 * most `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`,
	 * most `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all watchlist comments
	 */
	getUsersWatchlistComments(
		metadata: types.GetUsersWatchlistCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersWatchlistCommentsResponse200>> {
		return this.core.fetch('/users/{id}/watchlist/comments/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns movies rated by a user including each rating value and when it was rated.
	 *
	 * @summary Get movie ratings
	 */
	getUsersRatingsMovies(
		metadata: types.GetUsersRatingsMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRatingsMoviesResponse200>> {
		return this.core.fetch('/users/{id}/ratings/movies', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns shows rated by a user including each rating value and when it was rated.
	 *
	 * @summary Get show ratings
	 */
	getUsersRatingsShows(
		metadata: types.GetUsersRatingsShowsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRatingsShowsResponse200>> {
		return this.core.fetch('/users/{id}/ratings/shows', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns episodes rated by a user including each rating value and when it was rated.
	 *
	 * @summary Get episode ratings
	 */
	getUsersRatingsEpisodes(
		metadata: types.GetUsersRatingsEpisodesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRatingsEpisodesResponse200>> {
		return this.core.fetch('/users/{id}/ratings/episodes', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional ✨ Extended Info
	 * Returns all ratings by a user including each rating value and when it was rated.
	 *
	 * @summary Get all ratings
	 */
	getUsersRatingsAll(
		metadata: types.GetUsersRatingsAllMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRatingsAllResponse200>> {
		return this.core.fetch('/users/{id}/ratings/', 'get', metadata);
	}

	/**
	 * Returns ratings by a user for the requested media type and rating value.
	 *
	 * @summary Get ratings
	 */
	getUsersRatingsTypedRating(
		metadata: types.GetUsersRatingsTypedRatingMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRatingsTypedRatingResponse200>> {
		return this.core.fetch('/users/{id}/ratings/{type}/{rating}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns favorite movies and shows for a user. Use the `sort` path parameter plus query
	 * sorting and pagination to control the result order.
	 *
	 * @summary Get favorite media
	 */
	getUsersFavoritesMedia(
		metadata: types.GetUsersFavoritesMediaMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFavoritesMediaResponse200>> {
		return this.core.fetch('/users/{id}/favorites/media/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns favorite movies for a user. Use the `sort` path parameter plus query sorting and
	 * pagination to control the result order.
	 *
	 * @summary Get favorite movies
	 */
	getUsersFavoritesMovies(
		metadata: types.GetUsersFavoritesMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFavoritesMoviesResponse200>> {
		return this.core.fetch('/users/{id}/favorites/movies/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns favorite shows for a user. Use the `sort` path parameter plus query sorting and
	 * pagination to control the result order.
	 *
	 * @summary Get favorite shows
	 */
	getUsersFavoritesShows(
		metadata: types.GetUsersFavoritesShowsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFavoritesShowsResponse200>> {
		return this.core.fetch('/users/{id}/favorites/shows/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info 😁 Emojis
	 * Returns the top 100 shows and movies a user has favorited.
	 *
	 * @summary Get favorites
	 */
	getUsersFavoritesTypedSorted(
		metadata: types.GetUsersFavoritesTypedSortedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFavoritesTypedSortedResponse200>> {
		return this.core.fetch('/users/{id}/favorites/{type}/{sort_by}/{sort_how}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for the favorites. By default, the comments are sorted by
	 * most `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`,
	 * most `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all favorites comments
	 */
	getUsersFavoritesComments(
		metadata: types.GetUsersFavoritesCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFavoritesCommentsResponse200>> {
		return this.core.fetch('/users/{id}/favorites/comments/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 😁 Emojis
	 * Returns all personal lists for a user. Use the
	 * [**\/users/:id/lists/:list_id/items**](#reference/users/list-items) method to get the
	 * actual items a specific list contains.
	 *
	 * @summary Get a user's personal lists
	 */
	getUsersListsPersonal(
		metadata: types.GetUsersListsPersonalMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsPersonalResponse200>> {
		return this.core.fetch('/users/{id}/lists', 'get', metadata);
	}

	/**
	 * #### 🔥 VIP Enhanced 🔒 OAuth Required
	 * Create a new personal list. The `name` is the only required field, but the other info is
	 * recommended to ask for.
	 *
	 * #### Limits
	 *
	 * If the user's list limit is exceeded, a `420` HTTP error code is returned. Use the
	 * [**\/users/settings**](/reference/users/settings) method to get all limits for a user
	 * account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase
	 * the limits.
	 *
	 * #### Privacy
	 *
	 * Lists will be `private` by default. Here is what each value means.
	 *
	 * | Value | Privacy impact... |
	 * |---|---|
	 * | `private` | Only you can see the list. |
	 * | `link` | Anyone with the `share_link` can see the list. |
	 * | `friends` | Only your friends can see the list. |
	 * | `public` | Anyone can see the list. |
	 *
	 * #### JSON POST Data
	 * | Key | Type | Default | Value |
	 * |---|---|---|---|
	 * | `name` * | string |  | Name of the list. |
	 * | `description` | string |  | Description for this list. |
	 * | `privacy` | string | `private` | `private`, `link`, `friends`, `public` |
	 * | `display_numbers` | boolean | `false` | Should each item be numbered? |
	 * | `allow_comments` | boolean | `true` | Are comments allowed? |
	 * | `sort_by` | string | `rank` | `rank`, `added`, `title`, `released`, `runtime`,
	 * `popularity`, `random`, `percentage`, `imdb_rating`, `tmdb_rating`, `rt_tomatometer`,
	 * `rt_audience`, `metascore`, `votes`, `imdb_votes`, `tmdb_votes`, `my_rating`, `watched`,
	 * `collected` |
	 * | `sort_how` | string | `asc` | `asc`, `desc` |
	 *
	 * @summary Create personal list
	 */
	postUsersListsCreate(
		body: types.PostUsersListsCreateBodyParam,
		metadata: types.PostUsersListsCreateMetadataParam
	): Promise<FetchResponse<201, types.PostUsersListsCreateResponse201>> {
		return this.core.fetch('/users/{id}/lists', 'post', body, metadata);
	}

	/**
	 * #### 🔓 OAuth Optional
	 * Returns all lists a user can collaborate on. This gives full access to add, remove, and
	 * re-order list items. It essentially works just like a list owned by the user, just make
	 * sure to use the correct list owner `user` when building the API URLs.
	 *
	 * @summary Get all lists a user can collaborate on
	 */
	getUsersListsCollaborations(
		metadata: types.GetUsersListsCollaborationsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsCollaborationsResponse200>> {
		return this.core.fetch('/users/{id}/lists/collaborations', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Reorder all lists by sending the updated `rank` of list ids. Use the
	 * [**\/users/:id/lists**](#reference/users/lists) method to get all list ids.
	 *
	 * @summary Reorder a user's lists
	 */
	postUsersListsReorder(
		body: types.PostUsersListsReorderBodyParam,
		metadata: types.PostUsersListsReorderMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsReorderResponse200>> {
		return this.core.fetch('/users/{id}/lists/reorder', 'post', body, metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 😁 Emojis
	 * Returns a single personal list. Use the
	 * [**\/users/:id/lists/:list_id/items**](#reference/users/list-items) method to get the
	 * actual items this list contains.
	 *
	 * @summary Get personal list
	 */
	getUsersListsListSummary(
		metadata: types.GetUsersListsListSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListSummaryResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Update a personal list by sending 1 or more parameters. If you update the list name, the
	 * original slug will still be retained so existing references to this list won't break.
	 *
	 * #### Privacy
	 *
	 * Lists will be `private` by default. Here is what each value means.
	 *
	 * | Value | Privacy impact... |
	 * |---|---|
	 * | `private` | Only you can see the list. |
	 * | `link` | Anyone with the `share_link` can see the list. |
	 * | `friends` | Only your friends can see the list. |
	 * | `public` | Anyone can see the list. |
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|---|
	 * | `name` | string | Name of the list. |
	 * | `description` | string | Description for this list. |
	 * | `privacy` | string | `private`, `link`, `friends`, `public` |
	 * | `display_numbers` | boolean | Should each item be numbered? |
	 * | `allow_comments` | boolean | Are comments allowed? |
	 * | `sort_by` | string | `rank`, `added`, `title`, `released`, `runtime`, `popularity`,
	 * `random`, `percentage`, `imdb_rating`, `tmdb_rating`, `rt_tomatometer`, `rt_audience`,
	 * `metascore`, `votes`, `imdb_votes`, `tmdb_votes`, `my_rating`, `watched`, `collected` |
	 * | `sort_how` | string | `asc`, `desc` |
	 *
	 * @summary Update personal list
	 */
	putUsersListsListUpdate(
		body: types.PutUsersListsListUpdateBodyParam,
		metadata: types.PutUsersListsListUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutUsersListsListUpdateResponse200>>;
	putUsersListsListUpdate(
		metadata: types.PutUsersListsListUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutUsersListsListUpdateResponse200>>;
	putUsersListsListUpdate(
		body?: types.PutUsersListsListUpdateBodyParam | types.PutUsersListsListUpdateMetadataParam,
		metadata?: types.PutUsersListsListUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutUsersListsListUpdateResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/', 'put', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a personal list and all items it contains.
	 *
	 * @summary Delete a user's personal list
	 * @throws FetchError<403, types.DeleteUsersListsListDeleteResponse403> 403
	 */
	deleteUsersListsListDelete(
		metadata: types.DeleteUsersListsListDeleteMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersListsListDeleteResponse204>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/', 'delete', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movie items on a personal list. Use `list_id` to identify the list and query
	 * sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get movie list items
	 */
	getUsersListsListItemsMovie(
		metadata: types.GetUsersListsListItemsMovieMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListItemsMovieResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items/movie', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns show items on a personal list. Use `list_id` to identify the list and query
	 * sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get show list items
	 */
	getUsersListsListItemsShow(
		metadata: types.GetUsersListsListItemsShowMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListItemsShowResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items/show', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movie and show items on a personal list. Use `list_id` to identify the list and
	 * query sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get media list items
	 */
	getUsersListsListItemsMedia(
		metadata: types.GetUsersListsListItemsMediaMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListItemsMediaResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items/movie,show', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movie, show, season, and episode items on a personal list. Use `list_id` to
	 * identify the list and query sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get all list items
	 */
	getUsersListsListItemsAll(
		metadata: types.GetUsersListsListItemsAllMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListItemsAllResponse200>> {
		return this.core.fetch(
			'/users/{id}/lists/{list_id}/items/movie,show,season,episode',
			'get',
			metadata
		);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns items on a personal list. Use `type`, `sort_by`, and `sort_how` to control the
	 * returned item set and order.
	 *
	 * @summary Get items on a personal list
	 */
	getUsersListsListItemsTypedSorted(
		metadata: types.GetUsersListsListItemsTypedSortedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListItemsTypedSortedResponse200>> {
		return this.core.fetch(
			'/users/{id}/lists/{list_id}/items/{type}/{sort_by}/{sort_how}',
			'get',
			metadata
		);
	}

	/**
	 * #### 🔥 VIP Enhanced 🔒 OAuth Required 😁 Emojis
	 * Add one or more items to a personal list. Items can be movies, shows, seasons, episodes,
	 * or people.
	 *
	 * #### Notes
	 *
	 * Each list item can optionally accept a `notes` *(500 maximum characters)* field with
	 * custom text. The user must be a [**Trakt VIP**](https://trakt.tv/vip) to send `notes`.
	 *
	 * #### Limits
	 *
	 * If the user's list item limit is exceeded, a `420` HTTP error code is returned. Use the
	 * [**\/users/settings**](/reference/users/settings) method to get all limits for a user
	 * account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase
	 * the limits.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 * | `people` | array | Array of `person` objects. |
	 *
	 * @summary Add items to personal list
	 * @throws FetchError<420, types.PostUsersListsListAddResponse420> 420
	 */
	postUsersListsListAdd(
		body: types.PostUsersListsListAddBodyParam,
		metadata: types.PostUsersListsListAddMetadataParam
	): Promise<FetchResponse<201, types.PostUsersListsListAddResponse201>>;
	postUsersListsListAdd(
		metadata: types.PostUsersListsListAddMetadataParam
	): Promise<FetchResponse<201, types.PostUsersListsListAddResponse201>>;
	postUsersListsListAdd(
		body?: types.PostUsersListsListAddBodyParam | types.PostUsersListsListAddMetadataParam,
		metadata?: types.PostUsersListsListAddMetadataParam
	): Promise<FetchResponse<201, types.PostUsersListsListAddResponse201>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove one or more items from a personal list.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 * | `people` | array | Array of `person` objects. |
	 *
	 * @summary Remove items from personal list
	 */
	postUsersListsListRemove(
		body: types.PostUsersListsListRemoveBodyParam,
		metadata: types.PostUsersListsListRemoveMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsListRemoveResponse200>>;
	postUsersListsListRemove(
		metadata: types.PostUsersListsListRemoveMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsListRemoveResponse200>>;
	postUsersListsListRemove(
		body?: types.PostUsersListsListRemoveBodyParam | types.PostUsersListsListRemoveMetadataParam,
		metadata?: types.PostUsersListsListRemoveMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsListRemoveResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items/remove', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Reorder items on a personal list. Send the ordered list item IDs in the request body;
	 * the response returns the updated item order.
	 *
	 * @summary Reorder items on a list
	 */
	postUsersListsListReorder(
		body: types.PostUsersListsListReorderBodyParam,
		metadata: types.PostUsersListsListReorderMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsListReorderResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/reorder', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Reorder items on a personal list. Send the ordered list item IDs in the request body;
	 * the response returns the updated item order.
	 *
	 * @summary Reorder items on a list
	 */
	postUsersListsListReorderItems(
		body: types.PostUsersListsListReorderItemsBodyParam,
		metadata: types.PostUsersListsListReorderItemsMetadataParam
	): Promise<FetchResponse<200, types.PostUsersListsListReorderItemsResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/items/reorder', 'post', body, metadata);
	}

	/**
	 * Update a single personal list item by list item ID. A successful update returns no
	 * response body.
	 *
	 * @summary Update a list item
	 */
	putUsersListsListUpdateItem(
		body: types.PutUsersListsListUpdateItemBodyParam,
		metadata: types.PutUsersListsListUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutUsersListsListUpdateItemResponse204>>;
	putUsersListsListUpdateItem(
		metadata: types.PutUsersListsListUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutUsersListsListUpdateItemResponse204>>;
	putUsersListsListUpdateItem(
		body?:
			types.PutUsersListsListUpdateItemBodyParam | types.PutUsersListsListUpdateItemMetadataParam,
		metadata?: types.PutUsersListsListUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutUsersListsListUpdateItemResponse204>> {
		return this.core.fetch(
			'/users/{id}/lists/{list_id}/items/{list_item_id}',
			'put',
			body,
			metadata
		);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination
	 * Returns all users who liked a list.
	 *
	 * @summary Get all users who liked a list
	 */
	getUsersListsListLikes(
		metadata: types.GetUsersListsListLikesMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListLikesResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/likes', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Votes help determine popular lists. Only one like is allowed per list per user.
	 *
	 * @summary Like a list
	 */
	postUsersListsListLike(
		metadata: types.PostUsersListsListLikeMetadataParam
	): Promise<FetchResponse<204, types.PostUsersListsListLikeResponse204>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/like', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a like on a list.
	 *
	 * @summary Remove like on a list
	 */
	deleteUsersListsListUnlike(
		metadata: types.DeleteUsersListsListUnlikeMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersListsListUnlikeResponse204>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/like', 'delete', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for a list. By default, the comments are sorted by most
	 * `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`, most
	 * `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all list comments
	 */
	getUsersListsListComments(
		metadata: types.GetUsersListsListCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetUsersListsListCommentsResponse200>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/comments/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a list for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per list.
	 *
	 * @summary Report a user's list
	 * @throws FetchError<400, types.PostUsersListsListReportResponse400> 400
	 * @throws FetchError<409, types.PostUsersListsListReportResponse409> 409
	 */
	postUsersListsListReport(
		body: types.PostUsersListsListReportBodyParam,
		metadata: types.PostUsersListsListReportMetadataParam
	): Promise<FetchResponse<201, types.PostUsersListsListReportResponse201>> {
		return this.core.fetch('/users/{id}/lists/{list_id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Hide items for a specific section. Here's what type of items can hidden for each
	 * section. You can optionally specify the `hidden_at` date for each item.
	 *
	 * #### Hideable Media Objects
	 * | Section | Objects |
	 * |---|---|---|
	 * | `calendar` | `movie`, `show` |
	 * | `progress_watched` | `show`, `season` |
	 * | `progress_collected` | `show`, `season` |
	 * | `recommendations` | `movie`, `show` |
	 * | `comments` | `user` |
	 * | `dropped` | `show` |
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `users` | array | Array of `user` objects. |
	 *
	 * @summary Add hidden items
	 */
	postUsersHiddenAdd(
		body: types.PostUsersHiddenAddBodyParam,
		metadata: types.PostUsersHiddenAddMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenAddResponse200>>;
	postUsersHiddenAdd(
		metadata: types.PostUsersHiddenAddMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenAddResponse200>>;
	postUsersHiddenAdd(
		body?: types.PostUsersHiddenAddBodyParam | types.PostUsersHiddenAddMetadataParam,
		metadata?: types.PostUsersHiddenAddMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenAddResponse200>> {
		return this.core.fetch('/users/hidden/{section}', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns hidden items for a specific section. Use `type`, `page`, and `limit` to filter
	 * and paginate the hidden items.
	 *
	 * @summary Get hidden items
	 */
	getUsersHiddenGetBySection(
		metadata: types.GetUsersHiddenGetBySectionMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHiddenGetBySectionResponse200>> {
		return this.core.fetch('/users/hidden/{section}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns shows hidden from watched progress for the authenticated user. Use `type`,
	 * `page`, and `limit` to filter and paginate the hidden items.
	 *
	 * @summary Get hidden progress items
	 */
	getUsersHiddenGet(
		metadata: types.GetUsersHiddenGetMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHiddenGetResponse200>> {
		return this.core.fetch('/users/hidden/progress_watched', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns shows the authenticated user has dropped or hidden from progress. Use pagination
	 * to move through the hidden dropped list.
	 *
	 * @summary Get dropped shows
	 */
	getUsersHiddenDropped(
		metadata?: types.GetUsersHiddenDroppedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersHiddenDroppedResponse200>> {
		return this.core.fetch('/users/hidden/dropped', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove shows or seasons from hidden watched progress. Send hideable media objects in the
	 * request body; the response contains remove counts.
	 *
	 * @summary Remove hidden progress items
	 */
	postUsersHiddenRemoveProgress(
		body?: types.PostUsersHiddenRemoveProgressBodyParam
	): Promise<FetchResponse<200, types.PostUsersHiddenRemoveProgressResponse200>> {
		return this.core.fetch('/users/hidden/progress_watched/remove', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove movies or shows from hidden calendar items. Send hideable media objects in the
	 * request body; the response contains remove counts.
	 *
	 * @summary Remove hidden calendar items
	 */
	postUsersHiddenRemoveCalendar(
		body?: types.PostUsersHiddenRemoveCalendarBodyParam
	): Promise<FetchResponse<200, types.PostUsersHiddenRemoveCalendarResponse200>> {
		return this.core.fetch('/users/hidden/calendar/remove', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove hidden items for a specific section. Send hideable media objects in the request
	 * body; the response contains remove counts.
	 *
	 * @summary Remove hidden items
	 */
	postUsersHiddenRemoveSection(
		body: types.PostUsersHiddenRemoveSectionBodyParam,
		metadata: types.PostUsersHiddenRemoveSectionMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenRemoveSectionResponse200>>;
	postUsersHiddenRemoveSection(
		metadata: types.PostUsersHiddenRemoveSectionMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenRemoveSectionResponse200>>;
	postUsersHiddenRemoveSection(
		body?:
			types.PostUsersHiddenRemoveSectionBodyParam | types.PostUsersHiddenRemoveSectionMetadataParam,
		metadata?: types.PostUsersHiddenRemoveSectionMetadataParam
	): Promise<FetchResponse<200, types.PostUsersHiddenRemoveSectionResponse200>> {
		return this.core.fetch('/users/hidden/{section}/remove', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * List a user's pending follow requests so they can either approve or deny them.
	 *
	 * @summary Get follow requests
	 */
	getUsersRequestsFollow(
		metadata?: types.GetUsersRequestsFollowMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRequestsFollowResponse200>> {
		return this.core.fetch('/users/requests/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * List a user's pending following requests that they're waiting for the other user's to
	 * approve.
	 *
	 * @summary Get pending following requests
	 */
	getUsersRequestsFollowing(
		metadata?: types.GetUsersRequestsFollowingMetadataParam
	): Promise<FetchResponse<200, types.GetUsersRequestsFollowingResponse200>> {
		return this.core.fetch('/users/requests/following', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Approve a follower using the `id` of the request. If the `id` is not found, was already
	 * approved, or was already denied, a `404` error will be returned.
	 *
	 * @summary Approve follow request
	 * @throws FetchError<404, types.PostUsersRequestsApproveResponse404> 404
	 */
	postUsersRequestsApprove(
		metadata: types.PostUsersRequestsApproveMetadataParam
	): Promise<FetchResponse<200, types.PostUsersRequestsApproveResponse200>> {
		return this.core.fetch('/users/requests/{id}', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Deny a follower using the `id` of the request. If the `id` is not found, was already
	 * approved, or was already denied, a `404` error will be returned.
	 *
	 * @summary Deny follow request
	 * @throws FetchError<404, types.DeleteUsersRequestsDenyResponse404> 404
	 */
	deleteUsersRequestsDeny(
		metadata: types.DeleteUsersRequestsDenyMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersRequestsDenyResponse204>> {
		return this.core.fetch('/users/requests/{id}', 'delete', metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required 📄 Pagination
	 * Get all saved filters a user has created. The `path` and `query` can be used to
	 * construct an API path to retrieve the saved data. Think of this like a dynamically
	 * updated list.
	 *
	 * @summary Get saved filters
	 */
	getUsersFiltersSaved(
		metadata: types.GetUsersFiltersSavedMetadataParam
	): Promise<FetchResponse<200, types.GetUsersFiltersSavedResponse200>> {
		return this.core.fetch('/users/saved_filters/{section}', 'get', metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Create saved filters for the authenticated user. Send filter names and URLs in the
	 * request body; the response returns the created filter records.
	 *
	 * @summary Add saved filters
	 */
	postUsersFiltersAdd(
		body?: types.PostUsersFiltersAddBodyParam
	): Promise<FetchResponse<201, types.PostUsersFiltersAddResponse201>> {
		return this.core.fetch('/users/saved_filters', 'post', body);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Delete a saved filter by `id`. A successful delete returns `204`; an unknown filter
	 * returns `404`.
	 *
	 * @summary Delete saved filter
	 * @throws FetchError<404, types.DeleteUsersFiltersDeleteResponse404> 404
	 */
	deleteUsersFiltersDelete(
		metadata: types.DeleteUsersFiltersDeleteMetadataParam
	): Promise<FetchResponse<204, types.DeleteUsersFiltersDeleteResponse204>> {
		return this.core.fetch('/users/saved_filters/{id}', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the latest activity timestamps for the authenticated user. Cache these dates
	 * locally and compare them before syncing to avoid fetching data that has not changed.
	 *
	 * @summary Get last activity
	 */
	getSyncLastActivities(): Promise<FetchResponse<200, types.GetSyncLastActivitiesResponse200>> {
		return this.core.fetch('/sync/last_activities', 'get');
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns movies and episodes that a user has watched, sorted by most recent. Specify a
	 * `type` and Trakt `id` to limit the history for just that item.
	 *
	 * @summary Get watched history
	 */
	getSyncHistoryGet(
		metadata: types.GetSyncHistoryGetMetadataParam
	): Promise<FetchResponse<200, types.GetSyncHistoryGetResponse200>> {
		return this.core.fetch('/sync/history/{type}/{id}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Add items to a user's watch history. Accepts shows, seasons, episodes and movies. If
	 * only a show is passed, all episodes for the show will be added. If seasons are
	 * specified, only episodes in those seasons will be added.
	 *
	 * Send a `watched_at` UTC datetime to mark items as watched in the past. This is useful
	 * for syncing past watches from a media center.
	 *
	 * > ### IMPORTANT
	 * > _Please be careful with sending duplicate data. We don't verify the `item` +
	 * `watched_at` to ensure it's unique, it is up to your app to veify this and not send
	 * duplicate plays._
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 *
	 * #### Media Object POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | item * | object | `movie`, `show`, or `episode` object. |
	 * | `watched_at` | datetime | UTC datetime when the item was watched. Set to `released` to
	 * automatically use the initial release date + runtime *(episodes only)*. Set to `unknown`
	 * to mark the item as watched without a specific date. |
	 *
	 * @summary Add items to watched history
	 */
	postSyncHistoryAdd(
		body?: types.PostSyncHistoryAddBodyParam
	): Promise<FetchResponse<200, types.PostSyncHistoryAddResponse200>> {
		return this.core.fetch('/sync/history', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove items from a user's watch history including all watches, scrobbles, and checkins.
	 * Accepts shows, seasons, episodes and movies. If only a show is passed, all episodes for
	 * the show will be removed. If seasons are specified, only episodes in those seasons will
	 * be removed.
	 *
	 * You can also send a list of raw history `ids` _(64-bit integers)_ to delete single plays
	 * from the watched history. The [**\/sync/history**](#reference/sync/get-history) method
	 * will return an individual `id` _(64-bit integer)_ for each history item.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 * | `ids` | array | Array of history ids. |
	 *
	 * @summary Remove items from history
	 */
	postSyncHistoryRemove(
		body?: types.PostSyncHistoryRemoveBodyParam
	): Promise<FetchResponse<200, types.PostSyncHistoryRemoveResponse200>> {
		return this.core.fetch('/sync/history/remove', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns the authenticated user up next progress ordered by the requested sort. Use
	 * `include_stats` and `lifetime_stats` to include additional watch stats.
	 *
	 * @summary Get up next
	 */
	getSyncProgressUpNextStandard(
		metadata?: types.GetSyncProgressUpNextStandardMetadataParam
	): Promise<FetchResponse<200, types.GetSyncProgressUpNextStandardResponse200>> {
		return this.core.fetch('/sync/progress/up_next', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination
	 * Returns the authenticated user up next progress optimized for intent-based clients. Use
	 * `intent` plus sorting and pagination to control the response.
	 *
	 * @summary Get up next nitro
	 */
	getSyncProgressUpNextNitro(
		metadata?: types.GetSyncProgressUpNextNitroMetadataParam
	): Promise<FetchResponse<200, types.GetSyncProgressUpNextNitroResponse200>> {
		return this.core.fetch('/sync/progress/up_next_nitro', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info
	 * Returns in-progress movie playback items for the authenticated user. Use `start_at` and
	 * `end_at` to filter progress updated within a UTC datetime range.
	 *
	 * @summary Get movie playback progress
	 */
	getSyncProgressMovies(
		metadata?: types.GetSyncProgressMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetSyncProgressMoviesResponse200>> {
		return this.core.fetch('/sync/playback/movies', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info
	 * Returns playback progress for the requested media `type`. Use `start_at` and `end_at` to
	 * filter progress updated within a UTC datetime range.
	 *
	 * @summary Get playback progress
	 */
	getSyncProgressPlayback(
		metadata: types.GetSyncProgressPlaybackMetadataParam
	): Promise<FetchResponse<200, types.GetSyncProgressPlaybackResponse200>> {
		return this.core.fetch('/sync/playback/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a playback item from a user's playback progress list. A `404` will be returned if
	 * the `id` is invalid.
	 *
	 * @summary Remove a playback item
	 */
	deleteSyncProgressDropMovie(
		metadata: types.DeleteSyncProgressDropMovieMetadataParam
	): Promise<FetchResponse<204, types.DeleteSyncProgressDropMovieResponse204>> {
		return this.core.fetch('/sync/playback/{id}', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns watched progress for the authenticated user. Use hide filters to include or
	 * exclude completed, incomplete, or currently rewatching shows.
	 *
	 * @summary Get watched progress
	 */
	getSyncProgressWatched(
		metadata?: types.GetSyncProgressWatchedMetadataParam
	): Promise<FetchResponse<200, types.GetSyncProgressWatchedResponse200>> {
		return this.core.fetch('/sync/progress/watched', 'get', metadata);
	}

	/**
	 * Returns all movies, shows, seasons, or episodes watched by the authenticated user.
	 *
	 * @summary Get watched
	 */
	getSyncWatched(
		metadata: types.GetSyncWatchedMetadataParam
	): Promise<FetchResponse<200, types.GetSyncWatchedResponse200>> {
		return this.core.fetch('/sync/watched/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info 😁 Emojis
	 * Returns all items in the authenticated user's watchlist filtered by type.
	 *
	 * @summary Get watchlist
	 */
	getSyncWatchlistGet(
		metadata: types.GetSyncWatchlistGetMetadataParam
	): Promise<FetchResponse<200, types.GetSyncWatchlistGetResponse200>> {
		return this.core.fetch('/sync/watchlist/{type}/{sort_by}/{sort_how}', 'get', metadata);
	}

	/**
	 * Update watchlist item metadata such as notes or rank for multiple items.
	 *
	 * @summary Update watchlist
	 */
	putSyncWatchlistUpdate(
		body?: types.PutSyncWatchlistUpdateBodyParam
	): Promise<FetchResponse<200, types.PutSyncWatchlistUpdateResponse200>> {
		return this.core.fetch('/sync/watchlist', 'put', body);
	}

	/**
	 * #### 🔥 VIP Enhanced 🔒 OAuth Required 😁 Emojis
	 * Add one of more items to a user's watchlist. Accepts shows, seasons, episodes and
	 * movies. If only a show is passed, only the show itself will be added. If seasons are
	 * specified, all of those seasons will be added.
	 *
	 * #### Notes
	 *
	 * Each watchlist item can optionally accept a `notes` *(500 maximum characters)* field
	 * with custom text. The user must be a [**Trakt VIP**](https://trakt.tv/vip) to send
	 * `notes`.
	 *
	 * #### Limits
	 *
	 * If the user's watchlist limit is exceeded, a `420` HTTP error code is returned. Use the
	 * [**\/users/settings**](/reference/users/settings) method to get all limits for a user
	 * account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase
	 * the limits.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 *
	 * @summary Add items to watchlist
	 */
	postSyncWatchlistAdd(
		body?: types.PostSyncWatchlistAddBodyParam
	): Promise<FetchResponse<201, types.PostSyncWatchlistAddResponse201>> {
		return this.core.fetch('/sync/watchlist', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove one or more items from a user's watchlist.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 *
	 * @summary Remove items from watchlist
	 */
	postSyncWatchlistRemove(
		body?: types.PostSyncWatchlistRemoveBodyParam
	): Promise<FetchResponse<200, types.PostSyncWatchlistRemoveResponse200>> {
		return this.core.fetch('/sync/watchlist/remove', 'post', body);
	}

	/**
	 * Reorder all items in a user watchlist by sending the ordered list item IDs.
	 *
	 * @summary Reorder watchlist items
	 */
	postSyncWatchlistReorder(
		body?: types.PostSyncWatchlistReorderBodyParam
	): Promise<FetchResponse<200, types.PostSyncWatchlistReorderResponse200>> {
		return this.core.fetch('/sync/watchlist/reorder', 'post', body);
	}

	/**
	 * Update a single watchlist item by list item ID. A successful update returns no response
	 * body.
	 *
	 * @summary Update a watchlist item
	 */
	putSyncWatchlistUpdateItem(
		body: types.PutSyncWatchlistUpdateItemBodyParam,
		metadata: types.PutSyncWatchlistUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncWatchlistUpdateItemResponse204>>;
	putSyncWatchlistUpdateItem(
		metadata: types.PutSyncWatchlistUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncWatchlistUpdateItemResponse204>>;
	putSyncWatchlistUpdateItem(
		body?:
			types.PutSyncWatchlistUpdateItemBodyParam | types.PutSyncWatchlistUpdateItemMetadataParam,
		metadata?: types.PutSyncWatchlistUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncWatchlistUpdateItemResponse204>> {
		return this.core.fetch('/sync/watchlist/{list_item_id}', 'put', body, metadata);
	}

	/**
	 * Returns all ratings for the requested media type and rating value.
	 *
	 * @summary Get ratings
	 */
	getSyncRatingsGet(
		metadata: types.GetSyncRatingsGetMetadataParam
	): Promise<FetchResponse<200, types.GetSyncRatingsGetResponse200>> {
		return this.core.fetch('/sync/ratings/{type}/{rating}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Rate one or more items. Accepts shows, seasons, episodes and movies. If only a show is
	 * passed, only the show itself will be rated. If seasons are specified, all of those
	 * seasons will be rated.
	 *
	 * Send a `rated_at` UTC datetime to mark items as rated in the past. This is useful for
	 * syncing ratings from a media center.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 *
	 * #### Media Object POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | item * | object | `movie`, `show`, `season`, or `episode` object. |
	 * | `rating` * | integer | Between 1 and 10. |
	 * | `rated_at` | datetime | UTC datetime when the item was rated. |
	 *
	 * @summary Add new ratings
	 */
	postSyncRatingsAdd(
		body?: types.PostSyncRatingsAddBodyParam
	): Promise<FetchResponse<201, types.PostSyncRatingsAddResponse201>> {
		return this.core.fetch('/sync/ratings', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove ratings for one or more items.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 * | `seasons` | array | Array of `season` objects. |
	 * | `episodes` | array | Array of `episode` objects. |
	 *
	 * @summary Remove ratings
	 */
	postSyncRatingsRemove(
		body?: types.PostSyncRatingsRemoveBodyParam
	): Promise<FetchResponse<200, types.PostSyncRatingsRemoveResponse200>> {
		return this.core.fetch('/sync/ratings/remove', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination Optional ✨ Extended Info 😁 Emojis
	 * Returns all items in the authenticated user's favorites filtered by type.
	 *
	 * @summary Get favorites
	 */
	getSyncFavoritesGet(
		metadata: types.GetSyncFavoritesGetMetadataParam
	): Promise<FetchResponse<200, types.GetSyncFavoritesGetResponse200>> {
		return this.core.fetch('/sync/favorites/{type}/{sort_by}/{sort_how}', 'get', metadata);
	}

	/**
	 * Update favorite item metadata such as notes or rank for multiple items.
	 *
	 * @summary Update favorites
	 */
	putSyncFavoritesUpdate(
		body?: types.PutSyncFavoritesUpdateBodyParam
	): Promise<FetchResponse<200, types.PutSyncFavoritesUpdateResponse200>> {
		return this.core.fetch('/sync/favorites', 'put', body);
	}

	/**
	 * #### 🔒 OAuth Required 😁 Emojis
	 * If the user only had 50 TV shows and movies to bring with them on a deserted island,
	 * what would they be? Apps should encourage user's to add favorites so the algorithm keeps
	 * getting better.
	 *
	 * #### Notes
	 *
	 * Each favorite can optionally accept a `notes` *(500 maximum characters)* field
	 * explaining why the user favorited the item.
	 *
	 * #### Limits
	 *
	 * If the user's favorite limit is exceeded, a `420` HTTP error code is returned. This
	 * limit applies to all users.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 *
	 * @summary Add items to favorites
	 */
	postSyncFavoritesAdd(
		body?: types.PostSyncFavoritesAddBodyParam
	): Promise<FetchResponse<201, types.PostSyncFavoritesAddResponse201>> {
		return this.core.fetch('/sync/favorites', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove items from a user's favorites. Apps should encourage user's to add favorites so
	 * the algorithm keeps getting better.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | `movies` | array | Array of `movie` objects. (see examples ->) |
	 * | `shows` | array | Array of `show` objects. |
	 *
	 * @summary Remove items from favorites
	 */
	postSyncFavoritesRemove(
		body?: types.PostSyncFavoritesRemoveBodyParam
	): Promise<FetchResponse<200, types.PostSyncFavoritesRemoveResponse200>> {
		return this.core.fetch('/sync/favorites/remove', 'post', body);
	}

	/**
	 * Reorder all items in a user favorites list by sending the ordered list item IDs.
	 *
	 * @summary Reorder favorited items
	 */
	postSyncFavoritesReorder(
		body?: types.PostSyncFavoritesReorderBodyParam
	): Promise<FetchResponse<200, types.PostSyncFavoritesReorderResponse200>> {
		return this.core.fetch('/sync/favorites/reorder', 'post', body);
	}

	/**
	 * Update a single favorite item by list item ID. A successful update returns no response
	 * body.
	 *
	 * @summary Update a favorite item
	 */
	putSyncFavoritesUpdateItem(
		body: types.PutSyncFavoritesUpdateItemBodyParam,
		metadata: types.PutSyncFavoritesUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncFavoritesUpdateItemResponse204>>;
	putSyncFavoritesUpdateItem(
		metadata: types.PutSyncFavoritesUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncFavoritesUpdateItemResponse204>>;
	putSyncFavoritesUpdateItem(
		body?:
			types.PutSyncFavoritesUpdateItemBodyParam | types.PutSyncFavoritesUpdateItemMetadataParam,
		metadata?: types.PutSyncFavoritesUpdateItemMetadataParam
	): Promise<FetchResponse<204, types.PutSyncFavoritesUpdateItemResponse204>> {
		return this.core.fetch('/sync/favorites/{list_item_id}', 'put', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * Returns all collected items for a media `type`.
	 *
	 * @summary Get collection
	 */
	getSyncCollectionAll(
		metadata: types.GetSyncCollectionAllMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionAllResponse200>> {
		return this.core.fetch('/sync/collection/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns movies in the authenticated user collection. Use `available_on` and pagination
	 * to filter and move through collected movies.
	 *
	 * @summary Get movie collection
	 */
	getSyncCollectionMovies(
		metadata?: types.GetSyncCollectionMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionMoviesResponse200>> {
		return this.core.fetch('/sync/collection/movies', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * Returns shows in the authenticated user collection, including collected seasons and
	 * episodes.
	 *
	 * @summary Get show collection
	 */
	getSyncCollectionShows(
		metadata?: types.GetSyncCollectionShowsMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionShowsResponse200>> {
		return this.core.fetch('/sync/collection/shows', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns episodes in the authenticated user collection. Use `available_on` and pagination
	 * to filter and move through collected episodes.
	 *
	 * @summary Get episode collection
	 */
	getSyncCollectionEpisodes(
		metadata?: types.GetSyncCollectionEpisodesMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionEpisodesResponse200>> {
		return this.core.fetch('/sync/collection/episodes', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
	 * Returns movies, shows, and episodes in the authenticated user collection. Use
	 * `available_on` and pagination to filter and move through collected media.
	 *
	 * @summary Get media collection
	 */
	getSyncCollectionMedia(
		metadata?: types.GetSyncCollectionMediaMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionMediaResponse200>> {
		return this.core.fetch('/sync/collection/media', 'get', metadata);
	}

	/**
	 * Add items to a user collection. Accepts shows, seasons, episodes, and movies.
	 *
	 * @summary Add items to collection
	 */
	postSyncCollectionAdd(
		body?: types.PostSyncCollectionAddBodyParam
	): Promise<FetchResponse<201, types.PostSyncCollectionAddResponse201>> {
		return this.core.fetch('/sync/collection', 'post', body);
	}

	/**
	 * Remove items from a user collection. Accepts shows, seasons, episodes, and movies.
	 *
	 * @summary Remove items from collection
	 */
	postSyncCollectionRemove(
		body?: types.PostSyncCollectionRemoveBodyParam
	): Promise<FetchResponse<200, types.PostSyncCollectionRemoveResponse200>> {
		return this.core.fetch('/sync/collection/remove', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the authenticated user movie collection in a minimal format optimized for
	 * syncing local state.
	 *
	 * @summary Get minimal movie collection
	 */
	getSyncCollectionMinimalMovies(
		metadata?: types.GetSyncCollectionMinimalMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionMinimalMoviesResponse200>> {
		return this.core.fetch('/sync/collection/minimal/movies', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the authenticated user show collection in a minimal format optimized for syncing
	 * local state.
	 *
	 * @summary Get minimal show collection
	 */
	getSyncCollectionMinimalShows(
		metadata?: types.GetSyncCollectionMinimalShowsMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionMinimalShowsResponse200>> {
		return this.core.fetch('/sync/collection/minimal/shows', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns the authenticated user episode collection in a minimal format optimized for
	 * syncing local state.
	 *
	 * @summary Get minimal episode collection
	 */
	getSyncCollectionMinimalEpisodes(
		metadata?: types.GetSyncCollectionMinimalEpisodesMetadataParam
	): Promise<FetchResponse<200, types.GetSyncCollectionMinimalEpisodesResponse200>> {
		return this.core.fetch('/sync/collection/minimal/episodes', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * Movie recommendations for a user. By default, `10` results are returned. You can send a
	 * `limit` to get up to `100` results per page. Set `ignore_collected=true` to filter out
	 * movies the user has already collected or `ignore_watchlisted=true` to filter out movies
	 * the user has already watchlisted.
	 *
	 * The `favorited_by` array contains all users who favorited the item along with any notes
	 * they added.
	 *
	 * @summary Get movie recommendations
	 */
	getRecommendationsMoviesRecommend(
		metadata: types.GetRecommendationsMoviesRecommendMetadataParam
	): Promise<FetchResponse<200, types.GetRecommendationsMoviesRecommendResponse200>> {
		return this.core.fetch('/recommendations/movies/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Hide a movie from getting recommended anymore.
	 *
	 * @summary Hide a movie recommendation
	 */
	deleteRecommendationsMoviesHide(
		metadata: types.DeleteRecommendationsMoviesHideMetadataParam
	): Promise<FetchResponse<204, types.DeleteRecommendationsMoviesHideResponse204>> {
		return this.core.fetch('/recommendations/movies/{id}', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required ✨ Extended Info
	 * TV show recommendations for a user. By default, `10` results are returned. You can send
	 * a `limit` to get up to `100` results per page. Set `ignore_collected=true` to filter out
	 * shows the user has already collected or `ignore_watchlisted=true` to filter out shows
	 * the user has already watchlisted.
	 *
	 * The `favorited_by` array contains all users who favorited the item along with any notes
	 * they added.
	 *
	 * @summary Get show recommendations
	 */
	getRecommendationsShowsRecommend(
		metadata: types.GetRecommendationsShowsRecommendMetadataParam
	): Promise<FetchResponse<200, types.GetRecommendationsShowsRecommendResponse200>> {
		return this.core.fetch('/recommendations/shows/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Hide a show from getting recommended anymore.
	 *
	 * @summary Hide a show recommendation
	 */
	deleteRecommendationsShowsHide(
		metadata: types.DeleteRecommendationsShowsHideMetadataParam
	): Promise<FetchResponse<204, types.DeleteRecommendationsShowsHideResponse204>> {
		return this.core.fetch('/recommendations/shows/{id}', 'delete', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns movie recommendations based on the authenticated user social graph. Use `limit`,
	 * `watch_window`, and ignore flags to tune the recommendation set.
	 *
	 * @summary Get social movie recommendations
	 */
	getSocial_recommendationsMoviesRecommend(
		metadata: types.GetSocialRecommendationsMoviesRecommendMetadataParam
	): Promise<FetchResponse<200, types.GetSocialRecommendationsMoviesRecommendResponse200>> {
		return this.core.fetch('/social_recommendations/movies/', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns show recommendations based on the authenticated user social graph. Use `limit`,
	 * `watch_window`, and ignore flags to tune the recommendation set.
	 *
	 * @summary Get social show recommendations
	 */
	getSocial_recommendationsShowsRecommend(
		metadata: types.GetSocialRecommendationsShowsRecommendMetadataParam
	): Promise<FetchResponse<200, types.GetSocialRecommendationsShowsRecommendResponse200>> {
		return this.core.fetch('/social_recommendations/shows/', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns trending movies and shows. Results are ordered by current watcher activity and
	 * can be filtered by media fields or ignored user state.
	 *
	 * @summary Get trending media
	 */
	getMediaTrending(
		metadata?: types.GetMediaTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetMediaTrendingResponse200>> {
		return this.core.fetch('/media/trending', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns anticipated movies and shows based on list activity. Results can be filtered by
	 * media fields or ignored user state.
	 *
	 * @summary Get anticipated media
	 */
	getMediaAnticipated(
		metadata?: types.GetMediaAnticipatedMetadataParam
	): Promise<FetchResponse<200, types.GetMediaAnticipatedResponse200>> {
		return this.core.fetch('/media/anticipated', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns popular movies and shows. Results can be filtered by media fields or ignored
	 * user state.
	 *
	 * @summary Get popular media
	 */
	getMediaPopular(
		metadata?: types.GetMediaPopularMetadataParam
	): Promise<FetchResponse<200, types.GetMediaPopularResponse200>> {
		return this.core.fetch('/media/popular', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns a single movie's details.
	 *
	 * > ### Note
	 * > _When getting `full` extended info, the `status` field can have a value of `released`,
	 * `in production`, `post production`, `planned`, `rumored`, or `canceled`._
	 *
	 * @summary Get a movie
	 */
	getMoviesSummary(
		metadata: types.GetMoviesSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesSummaryResponse200>> {
		return this.core.fetch('/movies/{id}', 'get', metadata);
	}

	/**
	 * Returns rating (between 0 and 10) and distribution for a movie.
	 *
	 * @summary Get movie ratings
	 */
	getMoviesRatings(
		metadata: types.GetMoviesRatingsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesRatingsResponse200>> {
		return this.core.fetch('/movies/{id}/ratings', 'get', metadata);
	}

	/**
	 * Returns lots of movie stats.
	 *
	 * @summary Get movie stats
	 */
	getMoviesStats(
		metadata: types.GetMoviesStatsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesStatsResponse200>> {
		return this.core.fetch('/movies/{id}/stats', 'get', metadata);
	}

	/**
	 * Returns all title aliases for a movie. Includes localized and alternate titles when
	 * available.
	 *
	 * @summary Get all movie aliases
	 */
	getMoviesAliases(
		metadata: types.GetMoviesAliasesMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesAliasesResponse200>> {
		return this.core.fetch('/movies/{id}/aliases', 'get', metadata);
	}

	/**
	 * Returns release dates for a movie in the requested country, including certification and
	 * release type when available.
	 *
	 * @summary Get all movie releases
	 */
	getMoviesReleases(
		metadata: types.GetMoviesReleasesMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesReleasesResponse200>> {
		return this.core.fetch('/movies/{id}/releases/{country}', 'get', metadata);
	}

	/**
	 * Returns all translations for a movie, including language, country, and translated values
	 * for title, tagline and overview. The `country` field can be used together with
	 * `language` to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).
	 *
	 * @summary Get all movie translations
	 */
	getMoviesTranslations(
		metadata: types.GetMoviesTranslationsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesTranslationsResponse200>> {
		return this.core.fetch('/movies/{id}/translations/{language}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 *
	 * Returns related and similar movies.
	 *
	 * @summary Get related movies
	 */
	getMoviesRelated(
		metadata: types.GetMoviesRelatedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesRelatedResponse200>> {
		return this.core.fetch('/movies/{id}/related', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all users watching this movie right now.
	 *
	 * @summary Get users watching right now
	 */
	getMoviesWatching(
		metadata: types.GetMoviesWatchingMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesWatchingResponse200>> {
		return this.core.fetch('/movies/{id}/watching', 'get', metadata);
	}

	/**
	 * Returns all studios for a movie.
	 *
	 * @summary Get movie studios
	 */
	getMoviesStudios(
		metadata: types.GetMoviesStudiosMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesStudiosResponse200>> {
		return this.core.fetch('/movies/{id}/studios', 'get', metadata);
	}

	/**
	 * #### 🫣 Limited Access ✨ Extended Info
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns streaming and watch now sources for a movie in the requested country. Use
	 * `links` to include provider links when available.
	 *
	 * @summary Get movie watch now sources
	 */
	getMoviesWatchnow(
		metadata: types.GetMoviesWatchnowMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesWatchnowResponse200>> {
		return this.core.fetch('/movies/{id}/watchnow/{country}', 'get', metadata);
	}

	/**
	 * #### 🫣 Limited Access
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns JustWatch links for a movie in the requested country. Use the movie `id` and
	 * two-character `country` path parameter to identify the lookup.
	 *
	 * @summary Get movie JustWatch links
	 */
	getMoviesJustwatchLink(
		metadata: types.GetMoviesJustwatchLinkMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesJustwatchLinkResponse200>> {
		return this.core.fetch('/movies/{id}/watchnow/justwatch_links/{country}', 'get', metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Queue a refresh of a movie's JustWatch watch now links.
	 *
	 * @summary Refresh movie JustWatch links
	 */
	postMoviesJustwatchRefresh(
		metadata: types.PostMoviesJustwatchRefreshMetadataParam
	): Promise<FetchResponse<201, types.PostMoviesJustwatchRefreshResponse201>> {
		return this.core.fetch('/movies/{id}/refresh/justwatch', 'post', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all `cast` and `crew` for a movie. Each `cast` member will have a `characters`
	 * array and a standard `person` object.
	 *
	 * The `crew` object will be broken up by department into `production`, `art`, `crew`,
	 * `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual effects`,
	 * `lighting`, and `editing` (if there are people for those crew positions). Each of those
	 * members will have a `jobs` array and a standard `person` object.
	 *
	 * @summary Get all people for a movie
	 */
	getMoviesPeople(
		metadata: types.GetMoviesPeopleMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesPeopleResponse200>> {
		return this.core.fetch('/movies/{id}/people', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all videos including trailers, teasers, clips, and featurettes.
	 *
	 * @summary Get all videos
	 */
	getMoviesVideos(
		metadata: types.GetMoviesVideosMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesVideosResponse200>> {
		return this.core.fetch('/movies/{id}/videos', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination 😁 Emojis
	 *
	 * Returns all lists that contain this movie. By default, `personal` lists are returned
	 * sorted by the most `popular`.
	 *
	 * @summary Get lists containing this movie
	 */
	getMoviesLists(
		metadata: types.GetMoviesListsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesListsResponse200>> {
		return this.core.fetch('/movies/{id}/lists/{type}/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for a movie. By default, comments are sorted by most
	 * `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`, most
	 * `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all movie comments
	 */
	getMoviesComments(
		metadata: types.GetMoviesCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesCommentsResponse200>> {
		return this.core.fetch('/movies/{id}/comments/{sort}', 'get', metadata);
	}

	/**
	 * Returns sentiment counts for comments and reactions attached to a movie.
	 *
	 * @summary Get movie sentiments
	 */
	getMoviesSentiments(
		metadata: types.GetMoviesSentimentsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesSentimentsResponse200>> {
		return this.core.fetch('/movies/{id}/sentiments', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a movie for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per movie.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another movie on Trakt |
	 * | `remove` | Should be removed from Trakt |
	 * | `data_refresh` | Request a full metadata refresh |
	 * | `metadata` | Metadata is wrong (title, overview, etc) |
	 * | `adult` | Marked as adult when it shouldn't be (or vice versa) |
	 * | `runtime` | Runtime is incorrect |
	 * | `language` | Not in English |
	 * | `spam` | Spam or fake title |
	 * | `tmdb` | Should use TMDB as the datasource |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a movie
	 * @throws FetchError<400, types.PostMoviesReportResponse400> 400
	 * @throws FetchError<409, types.PostMoviesReportResponse409> 409
	 */
	postMoviesReport(
		body: types.PostMoviesReportBodyParam,
		metadata: types.PostMoviesReportMetadataParam
	): Promise<FetchResponse<201, types.PostMoviesReportResponse201>> {
		return this.core.fetch('/movies/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Queue a full metadata refresh for a movie. Pass `images=true` to also refresh the
	 * movie's images.
	 *
	 * @summary Refresh movie metadata
	 */
	postMoviesRefresh(
		metadata: types.PostMoviesRefreshMetadataParam
	): Promise<FetchResponse<201, types.PostMoviesRefreshResponse201>> {
		return this.core.fetch('/movies/{id}/refresh', 'post', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most watched movies over the last 24 hours. Movies with the most `watchers`
	 * are returned first.
	 *
	 * @summary Get trending movies
	 */
	getMoviesTrending(
		metadata?: types.GetMoviesTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesTrendingResponse200>> {
		return this.core.fetch('/movies/trending', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most watched (unique users) movies in the specified time `period`,
	 * defaulting to `weekly`. All stats are relative to the specific time `period`.
	 *
	 * @summary Get the most watched movies
	 */
	getMoviesWatched(
		metadata: types.GetMoviesWatchedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesWatchedResponse200>> {
		return this.core.fetch('/movies/watched/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most favorited movies in the specified time `period`, defaulting to
	 * `weekly`.
	 *
	 * @summary Get the most favorited movies
	 */
	getMoviesFavorited(
		metadata: types.GetMoviesFavoritedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesFavoritedResponse200>> {
		return this.core.fetch('/movies/favorited/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most played movies in the specified time `period`, defaulting to `weekly`.
	 *
	 * @summary Get the most played movies
	 */
	getMoviesPlayed(
		metadata: types.GetMoviesPlayedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesPlayedResponse200>> {
		return this.core.fetch('/movies/played/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most collected movies in the specified time `period`, defaulting to
	 * `weekly`.
	 *
	 * @summary Get the most collected movies
	 */
	getMoviesCollected(
		metadata: types.GetMoviesCollectedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesCollectedResponse200>> {
		return this.core.fetch('/movies/collected/{period}', 'get', metadata);
	}

	/**
	 * Returns the top 10 grossing movies in the U.S. box office last weekend. Updated every
	 * Monday morning.
	 *
	 * @summary Get the weekend box office
	 */
	getMoviesBoxoffice(
		metadata?: types.GetMoviesBoxofficeMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesBoxofficeResponse200>> {
		return this.core.fetch('/movies/boxoffice', 'get', metadata);
	}

	/**
	 * Returns all movies updated since the specified UTC date. We recommend storing the latest
	 * `updated_at` locally and using it for the next request.
	 *
	 * @summary Get recently updated movies
	 */
	getMoviesUpdates(
		metadata: types.GetMoviesUpdatesMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesUpdatesResponse200>> {
		return this.core.fetch('/movies/updates/{start_date}', 'get', metadata);
	}

	/**
	 * Returns Trakt IDs for movies updated since the specified UTC date.
	 *
	 * @summary Get recently updated movie Trakt IDs
	 */
	getMoviesUpdatedIds(
		metadata: types.GetMoviesUpdatedIdsMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesUpdatedIdsResponse200>> {
		return this.core.fetch('/movies/updates/id/{start_date}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most anticipated movies based on the number of lists a movie appears on.
	 *
	 * @summary Get the most anticipated movies
	 */
	getMoviesAnticipated(
		metadata?: types.GetMoviesAnticipatedMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesAnticipatedResponse200>> {
		return this.core.fetch('/movies/anticipated', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movies that are currently hot on Trakt. Results can be filtered by media fields
	 * or ignored user state.
	 *
	 * @summary Get hot movies
	 */
	getMoviesHot(
		metadata?: types.GetMoviesHotMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesHotResponse200>> {
		return this.core.fetch('/movies/hot', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most popular movies. Popularity is calculated using the rating percentage
	 * and the number of ratings.
	 *
	 * @summary Get popular movies
	 */
	getMoviesPopular(
		metadata?: types.GetMoviesPopularMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesPopularResponse200>> {
		return this.core.fetch('/movies/popular', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns movies recently available on streaming services for the requested `period`.
	 * Results can be filtered by media fields or ignored user state.
	 *
	 * @summary Get streaming movies
	 */
	getMoviesStreaming(
		metadata: types.GetMoviesStreamingMetadataParam
	): Promise<FetchResponse<200, types.GetMoviesStreamingResponse200>> {
		return this.core.fetch('/movies/streaming/{period}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 😁 Emojis
	 * Add a new note to a movie, show, season, episode, person, or list.
	 *
	 * @summary Add notes
	 */
	postNotesCreate(
		body?: types.PostNotesCreateBodyParam
	): Promise<FetchResponse<201, types.PostNotesCreateResponse201>> {
		return this.core.fetch('/notes', 'post', body);
	}

	/**
	 * Returns a single note.
	 *
	 * @summary Get a note
	 */
	getNotesSummary(
		metadata: types.GetNotesSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetNotesSummaryResponse200>> {
		return this.core.fetch('/notes/{id}', 'get', metadata);
	}

	/**
	 * Update a single note.
	 *
	 * @summary Update a note
	 */
	putNotesUpdate(
		body: types.PutNotesUpdateBodyParam,
		metadata: types.PutNotesUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutNotesUpdateResponse200>>;
	putNotesUpdate(
		metadata: types.PutNotesUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutNotesUpdateResponse200>>;
	putNotesUpdate(
		body?: types.PutNotesUpdateBodyParam | types.PutNotesUpdateMetadataParam,
		metadata?: types.PutNotesUpdateMetadataParam
	): Promise<FetchResponse<200, types.PutNotesUpdateResponse200>> {
		return this.core.fetch('/notes/{id}', 'put', body, metadata);
	}

	/**
	 * Delete a single note.
	 *
	 * @summary Delete a note
	 */
	deleteNotesDelete(
		metadata: types.DeleteNotesDeleteMetadataParam
	): Promise<FetchResponse<204, types.DeleteNotesDeleteResponse204>> {
		return this.core.fetch('/notes/{id}', 'delete', metadata);
	}

	/**
	 * Returns the media item this note is attached to. The media type can be `movie`, `show`,
	 * `season`, `episode`, `person`, or `list` and it also returns the standard media object
	 * for that media type.
	 *
	 * @summary Get the attached item
	 */
	getNotesItem(
		metadata: types.GetNotesItemMetadataParam
	): Promise<FetchResponse<200, types.GetNotesItemResponse200>> {
		return this.core.fetch('/notes/{id}/item', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns a single shows's details. If you request extended info, the `airs` object is
	 * relative to the show's country. You can use the `day`, `time`, and `timezone` to
	 * construct your own date then convert it to whatever timezone your user is in.
	 *
	 * > ### Note
	 * > _When getting `full` extended info, the `status` field can have a value of `returning
	 * series` (airing right now),  `continuing` (airing right now), `in production` (airing
	 * soon), `planned` (in development), `upcoming` (in development),  `pilot`, `canceled`, or
	 * `ended`._
	 *
	 * @summary Get a single show
	 */
	getShowsSummary(
		metadata: types.GetShowsSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSummaryResponse200>> {
		return this.core.fetch('/shows/{id}', 'get', metadata);
	}

	/**
	 * Returns rating (between 0 and 10) and distribution for a show.
	 *
	 * @summary Get show ratings
	 */
	getShowsRatings(
		metadata: types.GetShowsRatingsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsRatingsResponse200>> {
		return this.core.fetch('/shows/{id}/ratings', 'get', metadata);
	}

	/**
	 * Returns lots of show stats.
	 *
	 * @summary Get show stats
	 */
	getShowsStats(
		metadata: types.GetShowsStatsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsStatsResponse200>> {
		return this.core.fetch('/shows/{id}/stats', 'get', metadata);
	}

	/**
	 * Returns all title aliases for a show. Includes localized and alternate titles when
	 * available.
	 *
	 * @summary Get all show aliases
	 */
	getShowsAliases(
		metadata: types.GetShowsAliasesMetadataParam
	): Promise<FetchResponse<200, types.GetShowsAliasesResponse200>> {
		return this.core.fetch('/shows/{id}/aliases', 'get', metadata);
	}

	/**
	 * Returns all content certifications for a show, grouped by country.
	 *
	 * @summary Get all show certifications
	 */
	getShowsCertifications(
		metadata: types.GetShowsCertificationsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsCertificationsResponse200>> {
		return this.core.fetch('/shows/{id}/certifications', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns collection progress for a show including details on all aired seasons and
	 * episodes. The `next_episode` will be the next episode the user should collect, if there
	 * are no upcoming episodes it will be set to `null`.
	 *
	 * By default, any hidden seasons will be removed from the response and stats. To include
	 * these and adjust the completion stats, set the `hidden` flag to `true`.
	 *
	 * @summary Get show collection progress
	 */
	getShowsProgressCollection(
		metadata: types.GetShowsProgressCollectionMetadataParam
	): Promise<FetchResponse<200, types.GetShowsProgressCollectionResponse200>> {
		return this.core.fetch('/shows/{id}/progress/collection', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Returns watched progress for a show including details on all aired seasons and episodes.
	 * The `next_episode` will be the next episode the user should watch, if there are no
	 * upcoming episodes it will be set to `null`. If not `null`, the `reset_at` date is when
	 * the user started re-watching the show. Your app can adjust the progress by ignoring
	 * episodes with a `last_watched_at` prior to the `reset_at`.
	 *
	 * By default, any hidden seasons will be removed from the response and stats. To include
	 * these and adjust the completion stats, set the `hidden` flag to `true`.
	 *
	 * By default, specials will be excluded from the response. Set the `specials` flag to
	 * `true` to include season 0 and adjust the stats accordingly. If you'd like to include
	 * specials, but not adjust the stats, set `count_specials` to `false`.
	 *
	 * By default, the `last_episode` and `next_episode` are calculated using the last `aired`
	 * episode the user has watched, even if they've watched older episodes more recently. To
	 * use their last watched episode for these calculations, set the `last_activity` flag to
	 * `watched`.
	 *
	 * > ### Note
	 * > _Only aired episodes are used to calculate progress. Episodes in the future or without
	 * an air date are ignored._
	 *
	 * @summary Get show watched progress
	 */
	getShowsProgressWatched(
		metadata: types.GetShowsProgressWatchedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsProgressWatchedResponse200>> {
		return this.core.fetch('/shows/{id}/progress/watched', 'get', metadata);
	}

	/**
	 * Reset a show progress. This starts re-watching a show and allows watched progress
	 * calculations to ignore previous watches.
	 *
	 * @summary Reset show progress
	 */
	postShowsProgressReset(
		metadata: types.PostShowsProgressResetMetadataParam
	): Promise<FetchResponse<200, types.PostShowsProgressResetResponse200>> {
		return this.core.fetch('/shows/{id}/progress/watched/reset', 'post', metadata);
	}

	/**
	 * Undo a show progress reset and restore normal watched progress calculations.
	 *
	 * @summary Undo reset show progress
	 */
	deleteShowsProgressUndoReset(
		metadata: types.DeleteShowsProgressUndoResetMetadataParam
	): Promise<FetchResponse<204, types.DeleteShowsProgressUndoResetResponse204>> {
		return this.core.fetch('/shows/{id}/progress/watched/reset', 'delete', metadata);
	}

	/**
	 * Returns all translations for a show, including language, country, and translated values
	 * for title, tagline and overview. The `country` field can be used together with
	 * `language` to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).
	 *
	 * @summary Get all show translations
	 */
	getShowsTranslations(
		metadata: types.GetShowsTranslationsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsTranslationsResponse200>> {
		return this.core.fetch('/shows/{id}/translations/{language}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 *
	 * Returns related and similar shows.
	 *
	 * @summary Get related shows
	 */
	getShowsRelated(
		metadata: types.GetShowsRelatedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsRelatedResponse200>> {
		return this.core.fetch('/shows/{id}/related', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all users watching this show right now.
	 *
	 * @summary Get users watching right now
	 */
	getShowsWatching(
		metadata: types.GetShowsWatchingMetadataParam
	): Promise<FetchResponse<200, types.GetShowsWatchingResponse200>> {
		return this.core.fetch('/shows/{id}/watching', 'get', metadata);
	}

	/**
	 * Returns the next scheduled episode for a show. If no episode is found, a `204` response
	 * is returned.
	 *
	 * @summary Get next episode
	 */
	getShowsNextEpisode(
		metadata: types.GetShowsNextEpisodeMetadataParam
	): Promise<
		| FetchResponse<200, types.GetShowsNextEpisodeResponse200>
		| FetchResponse<204, types.GetShowsNextEpisodeResponse204>
	> {
		return this.core.fetch('/shows/{id}/next_episode', 'get', metadata);
	}

	/**
	 * Returns the most recently aired episode for a show. If no episode is found, a `204`
	 * response is returned.
	 *
	 * @summary Get last episode
	 */
	getShowsLastEpisode(
		metadata: types.GetShowsLastEpisodeMetadataParam
	): Promise<
		| FetchResponse<200, types.GetShowsLastEpisodeResponse200>
		| FetchResponse<204, types.GetShowsLastEpisodeResponse204>
	> {
		return this.core.fetch('/shows/{id}/last_episode', 'get', metadata);
	}

	/**
	 * Returns all studios for a show.
	 *
	 * @summary Get show studios
	 */
	getShowsStudios(
		metadata: types.GetShowsStudiosMetadataParam
	): Promise<FetchResponse<200, types.GetShowsStudiosResponse200>> {
		return this.core.fetch('/shows/{id}/studios', 'get', metadata);
	}

	/**
	 * #### 🫣 Limited Access ✨ Extended Info
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns streaming and watch now sources for a show in the requested country. Use `links`
	 * to include provider links when available.
	 *
	 * @summary Get show watch now sources
	 */
	getShowsWatchnow(
		metadata: types.GetShowsWatchnowMetadataParam
	): Promise<FetchResponse<200, types.GetShowsWatchnowResponse200>> {
		return this.core.fetch('/shows/{id}/watchnow/{country}', 'get', metadata);
	}

	/**
	 * #### 🫣 Limited Access
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns JustWatch links for a show in the requested country. Use the show `id` and
	 * two-character `country` path parameter to identify the lookup.
	 *
	 * @summary Get show JustWatch links
	 */
	getShowsJustwatchLink(
		metadata: types.GetShowsJustwatchLinkMetadataParam
	): Promise<FetchResponse<200, types.GetShowsJustwatchLinkResponse200>> {
		return this.core.fetch('/shows/{id}/watchnow/justwatch_links/{country}', 'get', metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Queue a refresh of a show's JustWatch watch now links.
	 *
	 * @summary Refresh show JustWatch links
	 */
	postShowsJustwatchRefresh(
		metadata: types.PostShowsJustwatchRefreshMetadataParam
	): Promise<FetchResponse<201, types.PostShowsJustwatchRefreshResponse201>> {
		return this.core.fetch('/shows/{id}/refresh/justwatch', 'post', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all `cast` and `crew` for a show, including the `episode_count` for which they
	 * appears. Each `cast` member will have a `characters` array and a standard `person`
	 * object.
	 *
	 * The `crew` object will be broken up by department into `production`, `art`, `crew`,
	 * `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual effects`,
	 * `lighting`, `editing`, and `created  by` (if there are people for those crew positions).
	 * Each of those members will have a `jobs` array and a standard `person` object.
	 *
	 * #### Guest Stars
	 * If you add `?extended=guest_stars` to the URL, it will return all guest stars that
	 * appeared in at least 1 episode of the show.
	 *
	 * > ### Note
	 * > _This returns a lot of data, so please only use this extended parameter if you
	 * actually need it!_
	 *
	 * @summary Get all people for a show
	 */
	getShowsPeople(
		metadata: types.GetShowsPeopleMetadataParam
	): Promise<FetchResponse<200, types.GetShowsPeopleResponse200>> {
		return this.core.fetch('/shows/{id}/people', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all seasons for a show including the number of episodes in each season.
	 *
	 * #### Episodes
	 * If you add `?extended=episodes` to the URL, it will return all episodes for all seasons.
	 *
	 * > ### Note
	 * > _This returns a lot of data, so please only use this extended parameter if you
	 * actually need it!_
	 *
	 * @summary Get all seasons for a show
	 */
	getShowsSeasons(
		metadata: types.GetShowsSeasonsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons', 'get', metadata);
	}

	/**
	 * Returns a single season for a show including the number of episodes in that season.
	 *
	 * @summary Get single seasons for a show
	 */
	getShowsSeasonInfo(
		metadata: types.GetShowsSeasonInfoMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonInfoResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/info', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all episodes for a specific season of a show.
	 *
	 * #### Translations
	 * If you'd like to included translated episode titles and overviews in the response,
	 * include the `translations` parameter in the URL. Include all languages by setting the
	 * parameter to `all` or use a specific 2 digit country language code to further limit it.
	 * Each translation includes both `language` and `country` so regional variants (for
	 * example `fr`/`fr` vs `fr`/`ca`) can be distinguished.
	 *
	 * > ### Note
	 * > _This returns a lot of data, so please only use this extended parameter if you
	 * actually need it!_
	 *
	 * @summary Get all episodes for a single season
	 */
	getShowsSeasonEpisodes(
		metadata: types.GetShowsSeasonEpisodesMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonEpisodesResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}', 'get', metadata);
	}

	/**
	 * Returns all translations for a season, including language, country, and translated title
	 * and overview values.
	 *
	 * @summary Get all season translations
	 */
	getShowsSeasonTranslations(
		metadata: types.GetShowsSeasonTranslationsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonTranslationsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/translations/{language}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for a season. By default, comments are sorted by most
	 * `likes`.
	 *
	 * @summary Get all season comments
	 */
	getShowsSeasonComments(
		metadata: types.GetShowsSeasonCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonCommentsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/comments/{sort}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination 😁 Emojis
	 *
	 * Returns all lists that contain this season. By default, `personal` lists are returned
	 * sorted by the most `popular`.
	 *
	 * @summary Get lists containing this season
	 */
	getShowsSeasonLists(
		metadata: types.GetShowsSeasonListsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonListsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/lists/{type}/{sort}', 'get', metadata);
	}

	/**
	 * Returns all cast and crew for a season. Each cast member will have a characters array
	 * and a standard person object.
	 *
	 * @summary Get all people for a season
	 */
	getShowsSeasonPeople(
		metadata: types.GetShowsSeasonPeopleMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonPeopleResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/people', 'get', metadata);
	}

	/**
	 * Returns rating (between 0 and 10) and distribution for a season.
	 *
	 * @summary Get season ratings
	 */
	getShowsSeasonRatings(
		metadata: types.GetShowsSeasonRatingsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonRatingsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/ratings', 'get', metadata);
	}

	/**
	 * Returns lots of season stats.
	 *
	 * @summary Get season stats
	 */
	getShowsSeasonStats(
		metadata: types.GetShowsSeasonStatsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonStatsResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/stats', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all users watching this season right now.
	 *
	 * @summary Get users watching right now
	 */
	getShowsSeasonWatching(
		metadata: types.GetShowsSeasonWatchingMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonWatchingResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/watching', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all videos including trailers, teasers, clips, and featurettes.
	 *
	 * @summary Get all videos
	 */
	getShowsSeasonVideos(
		metadata: types.GetShowsSeasonVideosMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonVideosResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/videos', 'get', metadata);
	}

	/**
	 * #### 🫣 Limited Access
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns JustWatch links for a show season in the requested country. Use `id`, `season`,
	 * and the two-character `country` path parameter to identify the lookup.
	 *
	 * @summary Get season JustWatch links
	 */
	getShowsSeasonJustwatchLink(
		metadata: types.GetShowsSeasonJustwatchLinkMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSeasonJustwatchLinkResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/watchnow/justwatch_links/{country}',
			'get',
			metadata
		);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a season for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per season.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another season on Trakt |
	 * | `remove` | Should be removed from Trakt |
	 * | `data_refresh` | Request a full metadata refresh |
	 * | `metadata` | Metadata is wrong (title, overview, etc) |
	 * | `adult` | Marked as adult when it shouldn't be (or vice versa) |
	 * | `runtime` | Runtime is incorrect |
	 * | `language` | Not in English |
	 * | `spam` | Spam or fake season |
	 * | `tmdb` | Should use TMDB as the datasource |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a season
	 * @throws FetchError<400, types.PostShowsSeasonReportResponse400> 400
	 * @throws FetchError<409, types.PostShowsSeasonReportResponse409> 409
	 */
	postShowsSeasonReport(
		body: types.PostShowsSeasonReportBodyParam,
		metadata: types.PostShowsSeasonReportMetadataParam
	): Promise<FetchResponse<201, types.PostShowsSeasonReportResponse201>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/report', 'post', body, metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all videos including trailers, teasers, clips, and featurettes.
	 *
	 * @summary Get all videos
	 */
	getShowsVideos(
		metadata: types.GetShowsVideosMetadataParam
	): Promise<FetchResponse<200, types.GetShowsVideosResponse200>> {
		return this.core.fetch('/shows/{id}/videos', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination 😁 Emojis
	 *
	 * Returns all lists that contain this show. By default, `personal` lists are returned
	 * sorted by the most `popular`.
	 *
	 * @summary Get lists containing this show
	 */
	getShowsLists(
		metadata: types.GetShowsListsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsListsResponse200>> {
		return this.core.fetch('/shows/{id}/lists/{type}/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for a show. By default, comments are sorted by most
	 * `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`, highest
	 * `watched` percentage, most `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all show comments
	 */
	getShowsComments(
		metadata: types.GetShowsCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsCommentsResponse200>> {
		return this.core.fetch('/shows/{id}/comments/{sort}', 'get', metadata);
	}

	/**
	 * Returns sentiment counts for comments and reactions attached to a show.
	 *
	 * @summary Get show sentiments
	 */
	getShowsSentiments(
		metadata: types.GetShowsSentimentsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsSentimentsResponse200>> {
		return this.core.fetch('/shows/{id}/sentiments', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a show for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per show.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another show on Trakt |
	 * | `remove` | Should be removed from Trakt |
	 * | `data_refresh` | Request a full metadata refresh |
	 * | `metadata` | Metadata is wrong (title, overview, etc) |
	 * | `adult` | Marked as adult when it shouldn't be (or vice versa) |
	 * | `runtime` | Runtime is incorrect |
	 * | `language` | Not in English |
	 * | `spam` | Spam or fake title |
	 * | `tmdb` | Should use TMDB as the datasource |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a show
	 * @throws FetchError<400, types.PostShowsReportResponse400> 400
	 * @throws FetchError<409, types.PostShowsReportResponse409> 409
	 */
	postShowsReport(
		body: types.PostShowsReportBodyParam,
		metadata: types.PostShowsReportMetadataParam
	): Promise<FetchResponse<201, types.PostShowsReportResponse201>> {
		return this.core.fetch('/shows/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Queue a full metadata refresh for a show. Pass `images=true` to also refresh the show's
	 * images.
	 *
	 * @summary Refresh show metadata
	 */
	postShowsRefresh(
		metadata: types.PostShowsRefreshMetadataParam
	): Promise<FetchResponse<201, types.PostShowsRefreshResponse201>> {
		return this.core.fetch('/shows/{id}/refresh', 'post', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns a single episode's details. All date and times are in UTC and were calculated
	 * using the episode's `air_date` and show's `country` and `air_time`.
	 *
	 * > ### Note
	 * > _If the `first_aired` is unknown, it will be set to `null`._
	 *
	 * > ### Note
	 * > _When getting `full` extended info, the `episode_type` field can have a value of
	 * `standard`, `series_premiere` (season 1, episode 1), `season_premiere` (episode 1),
	 * `mid_season_finale`, `mid_season_premiere` (the next episode after the mid season
	 * finale), `season_finale`, or `series_finale` (last episode to air for an ended show)._
	 *
	 * @summary Get a single episode for a show
	 */
	getShowsEpisodeSummary(
		metadata: types.GetShowsEpisodeSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeSummaryResponse200>> {
		return this.core.fetch('/shows/{id}/seasons/{season}/episodes/{episode}', 'get', metadata);
	}

	/**
	 * Returns all translations for an episode, including language, country, and translated
	 * values for title and overview. The `country` field can be used together with `language`
	 * to identify regional variants (for example `fr`/`fr` vs `fr`/`ca`).
	 *
	 * @summary Get all episode translations
	 */
	getShowsEpisodeTranslations(
		metadata: types.GetShowsEpisodeTranslationsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeTranslationsResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/translations/{language}',
			'get',
			metadata
		);
	}

	/**
	 * Returns lots of episode stats.
	 *
	 * @summary Get episode stats
	 */
	getShowsEpisodeStats(
		metadata: types.GetShowsEpisodeStatsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeStatsResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/stats',
			'get',
			metadata
		);
	}

	/**
	 * Returns rating (between 0 and 10) and distribution for an episode.
	 *
	 * @summary Get episode ratings
	 */
	getShowsEpisodeRatings(
		metadata: types.GetShowsEpisodeRatingsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeRatingsResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/ratings',
			'get',
			metadata
		);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all users watching this episode right now.
	 *
	 * @summary Get users watching right now
	 */
	getShowsEpisodeWatching(
		metadata: types.GetShowsEpisodeWatchingMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeWatchingResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/watching',
			'get',
			metadata
		);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for an episode. By default, comments are sorted by most
	 * `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`, most
	 * `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all episode comments
	 */
	getShowsEpisodeComments(
		metadata: types.GetShowsEpisodeCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeCommentsResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/comments/{sort}',
			'get',
			metadata
		);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all `cast` and `crew` for an episode. Each `cast` member will have a
	 * `characters` array and a standard `person` object.
	 *
	 * The `crew` object will be broken up by department into `production`, `art`, `crew`,
	 * `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual effects`,
	 * `lighting`, and `editing` (if there are people for those crew positions). Each of those
	 * members will have a `jobs` array and a standard `person` object.
	 *
	 * #### Guest Stars
	 * If you add `?extended=guest_stars` to the URL, it will return all guest stars that
	 * appeared in the episode.
	 *
	 * > ### Note
	 * > _This returns a lot of data, so please only use this extended parameter if you
	 * actually need it!_
	 *
	 * @summary Get all people for an episode
	 */
	getShowsEpisodePeople(
		metadata: types.GetShowsEpisodePeopleMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodePeopleResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/people',
			'get',
			metadata
		);
	}

	/**
	 * #### 📄 Pagination 😁 Emojis
	 *
	 * Returns all lists that contain this episode. By default, `personal` lists are returned
	 * sorted by the most `popular`.
	 *
	 * @summary Get lists containing this episode
	 */
	getShowsEpisodeLists(
		metadata: types.GetShowsEpisodeListsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeListsResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/lists/{type}/{sort}',
			'get',
			metadata
		);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all videos including trailers, teasers, clips, and featurettes.
	 *
	 * @summary Get all videos
	 */
	getShowsEpisodeVideos(
		metadata: types.GetShowsEpisodeVideosMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeVideosResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/videos',
			'get',
			metadata
		);
	}

	/**
	 * #### 🫣 Limited Access ✨ Extended Info
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns streaming and watch now sources for an episode in the requested country. Use
	 * `links` to include provider links when available.
	 *
	 * @summary Get episode watch now sources
	 */
	getShowsEpisodeWatchnow(
		metadata: types.GetShowsEpisodeWatchnowMetadataParam
	): Promise<FetchResponse<200, types.GetShowsEpisodeWatchnowResponse200>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/watchnow/{country}',
			'get',
			metadata
		);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report an episode for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per episode.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another episode on Trakt |
	 * | `remove` | Should be removed from Trakt |
	 * | `data_refresh` | Request a full metadata refresh |
	 * | `metadata` | Metadata is wrong (title, overview, etc) |
	 * | `adult` | Marked as adult when it shouldn't be (or vice versa) |
	 * | `runtime` | Runtime is incorrect |
	 * | `language` | Not in English |
	 * | `spam` | Spam or fake episode |
	 * | `tmdb` | Should use TMDB as the datasource |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report an episode
	 * @throws FetchError<400, types.PostShowsEpisodeReportResponse400> 400
	 * @throws FetchError<409, types.PostShowsEpisodeReportResponse409> 409
	 */
	postShowsEpisodeReport(
		body: types.PostShowsEpisodeReportBodyParam,
		metadata: types.PostShowsEpisodeReportMetadataParam
	): Promise<FetchResponse<201, types.PostShowsEpisodeReportResponse201>> {
		return this.core.fetch(
			'/shows/{id}/seasons/{season}/episodes/{episode}/report',
			'post',
			body,
			metadata
		);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most watched shows over the last 24 hours. Shows with the most `watchers`
	 * are returned first.
	 *
	 * @summary Get trending shows
	 */
	getShowsTrending(
		metadata?: types.GetShowsTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetShowsTrendingResponse200>> {
		return this.core.fetch('/shows/trending', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most watched (unique users) shows in the specified time `period`, defaulting
	 * to `weekly`. All stats are relative to the specific time `period`.
	 *
	 * @summary Get the most watched shows
	 */
	getShowsWatched(
		metadata: types.GetShowsWatchedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsWatchedResponse200>> {
		return this.core.fetch('/shows/watched/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most favorited shows in the specified time `period`, defaulting to `weekly`.
	 *
	 * @summary Get the most favorited shows
	 */
	getShowsFavorited(
		metadata: types.GetShowsFavoritedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsFavoritedResponse200>> {
		return this.core.fetch('/shows/favorited/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most played shows in the specified time `period`, defaulting to `weekly`.
	 *
	 * @summary Get the most played shows
	 */
	getShowsPlayed(
		metadata: types.GetShowsPlayedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsPlayedResponse200>> {
		return this.core.fetch('/shows/played/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most collected shows in the specified time `period`, defaulting to `weekly`.
	 *
	 * @summary Get the most collected shows
	 */
	getShowsCollected(
		metadata: types.GetShowsCollectedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsCollectedResponse200>> {
		return this.core.fetch('/shows/collected/{period}', 'get', metadata);
	}

	/**
	 * Returns all shows updated since the specified UTC date. We recommend storing the latest
	 * `updated_at` locally and using it for the next request.
	 *
	 * @summary Get recently updated shows
	 */
	getShowsUpdates(
		metadata: types.GetShowsUpdatesMetadataParam
	): Promise<FetchResponse<200, types.GetShowsUpdatesResponse200>> {
		return this.core.fetch('/shows/updates/{start_date}', 'get', metadata);
	}

	/**
	 * Returns Trakt IDs for shows updated since the specified UTC date.
	 *
	 * @summary Get recently updated show Trakt IDs
	 */
	getShowsUpdatedIds(
		metadata: types.GetShowsUpdatedIdsMetadataParam
	): Promise<FetchResponse<200, types.GetShowsUpdatedIdsResponse200>> {
		return this.core.fetch('/shows/updates/id/{start_date}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most anticipated shows based on the number of lists a show appears on.
	 *
	 * @summary Get the most anticipated shows
	 */
	getShowsAnticipated(
		metadata?: types.GetShowsAnticipatedMetadataParam
	): Promise<FetchResponse<200, types.GetShowsAnticipatedResponse200>> {
		return this.core.fetch('/shows/anticipated', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns shows that are currently hot on Trakt. Results can be filtered by media fields
	 * or ignored user state.
	 *
	 * @summary Get hot shows
	 */
	getShowsHot(
		metadata?: types.GetShowsHotMetadataParam
	): Promise<FetchResponse<200, types.GetShowsHotResponse200>> {
		return this.core.fetch('/shows/hot', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 *
	 * Returns the most popular shows. Popularity is calculated using the rating percentage and
	 * the number of ratings.
	 *
	 * @summary Get popular shows
	 */
	getShowsPopular(
		metadata?: types.GetShowsPopularMetadataParam
	): Promise<FetchResponse<200, types.GetShowsPopularResponse200>> {
		return this.core.fetch('/shows/popular', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters
	 * Returns shows recently available on streaming services for the requested `period`.
	 * Results can be filtered by media fields or ignored user state.
	 *
	 * @summary Get streaming shows
	 */
	getShowsStreaming(
		metadata: types.GetShowsStreamingMetadataParam
	): Promise<FetchResponse<200, types.GetShowsStreamingResponse200>> {
		return this.core.fetch('/shows/streaming/{period}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 *
	 * Search all text fields that a media object contains (i.e. title, overview, etc). Results
	 * are ordered by the most relevant score. Specify the `type` of results by sending a
	 * single value or a comma delimited string for multiple types.
	 *
	 * #### Special Characters
	 *
	 * Our search engine gives the following characters special meaning when they appear in a
	 * query:
	 *
	 * `+ - && || ! ( ) { } [ ] ^ " ~ * ? : /`
	 *
	 * To interpret any of these characters literally (and not as a special character), precede
	 * the character with a backslash `\` character.
	 *
	 * #### Search Fields
	 *
	 * By default, certain text fields are used to search for the `query`. You can optionally
	 * specify the `fields` parameter with a single value or comma delimited string for
	 * multiple fields. Each `type` has specific `fields` that can be specified. This can be
	 * useful if you want to support more strict searches (i.e. title only).
	 *
	 * | Type | Field | Default |
	 * |---|---|---|
	 * | `movie` | `title` | &#10003; |
	 * |  | `original_title` | &#10003; |
	 * |  | `translations` | &#10003; |
	 * |  | `aliases` | &#10003; |
	 * |  | `tagline` | |
	 * |  | `overview` | |
	 * |  | `people` | |
	 * | `show` | `title` | &#10003; |
	 * |  | `original_title` | &#10003; |
	 * |  | `translations` | &#10003; |
	 * |  | `aliases` | &#10003; |
	 * |  | `overview` | |
	 * |  | `people` | |
	 * | `episode` | `title` | &#10003; |
	 * |  | `show_title` | &#10003; |
	 * |  | `overview` | |
	 * | `person` | `name` | &#10003; |
	 * |  | `biography` | |
	 * | `list` | `name` | &#10003; |
	 * |  | `description` | &#10003; |
	 *
	 * @summary Get text query results
	 */
	getSearchQuery(
		metadata: types.GetSearchQueryMetadataParam
	): Promise<FetchResponse<200, types.GetSearchQueryResponse200>> {
		return this.core.fetch('/search/{type}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 * Search for exact movie or show matches using the requested search `type` and `query`.
	 * Results are paginated and can include extended media details.
	 *
	 * @summary Get exact text query results
	 */
	getSearchExact(
		metadata: types.GetSearchExactMetadataParam
	): Promise<FetchResponse<200, types.GetSearchExactResponse200>> {
		return this.core.fetch('/search/{type}/exact', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 * Lookup items by external ID. Use `id_type` and `id` to identify the external ID, and
	 * optionally send `type` to limit the result media type.
	 *
	 * @summary Get ID lookup results
	 */
	getSearchLookup(
		metadata: types.GetSearchLookupMetadataParam
	): Promise<FetchResponse<200, types.GetSearchLookupResponse200>> {
		return this.core.fetch('/search/{id_type}/{id}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 * Returns globally trending recent searches by `type`. Use `query` to narrow the search
	 * text and pagination to move through the result set.
	 *
	 * @summary Get trending search results
	 */
	getSearchTrending(
		metadata: types.GetSearchTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetSearchTrendingResponse200>> {
		return this.core.fetch('/search/recent_by_id/global/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Add a recent search for the authenticated user. Send the search request body; a
	 * successful create returns `201` with no response body.
	 *
	 * @summary Add recent search
	 */
	postSearchRecentAdd(
		body: types.PostSearchRecentAddBodyParam
	): Promise<FetchResponse<201, types.PostSearchRecentAddResponse201>> {
		return this.core.fetch('/search/recent/', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a recent search for the authenticated user. Send the search request body; a
	 * successful delete returns `204` with no response body.
	 *
	 * @summary Remove recent search
	 */
	postSearchRecentRemove(
		body: types.PostSearchRecentRemoveBodyParam
	): Promise<FetchResponse<204, types.PostSearchRecentRemoveResponse204>> {
		return this.core.fetch('/search/recent/remove', 'post', body);
	}

	/**
	 * Returns all people updated since the specified UTC date. We recommend storing the latest
	 * `updated_at` locally and using it for the next request.
	 *
	 * @summary Get recently updated people
	 */
	getPeopleUpdates(
		metadata: types.GetPeopleUpdatesMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleUpdatesResponse200>> {
		return this.core.fetch('/people/updates/{start_date}', 'get', metadata);
	}

	/**
	 * Returns Trakt IDs for people updated since the specified UTC date.
	 *
	 * @summary Get recently updated people Trakt IDs
	 */
	getPeopleUpdatedIds(
		metadata: types.GetPeopleUpdatedIdsMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleUpdatedIdsResponse200>> {
		return this.core.fetch('/people/updates/id/{start_date}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns a single person's details.
	 *
	 * #### Gender
	 * If available, the `gender` property will be set to `male`, `female`, or `non_binary`.
	 *
	 * #### Known For Department
	 * If available, the `known_for_department` property will be set to `production`, `art`,
	 * `crew`, `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual
	 * effects`, `lighting`, or `editing`. Many people have credits across departments,
	 * `known_for` allows you to select their default credits more accurately.
	 *
	 * @summary Get a single person
	 */
	getPeopleSummary(
		metadata: types.GetPeopleSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleSummaryResponse200>> {
		return this.core.fetch('/people/{id}/', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all movies where this person is in the `cast` or `crew`. Each `cast` object will
	 * have a `characters` array and a standard `movie` object.
	 *
	 * The `crew` object will be broken up by department into `production`, `art`, `crew`,
	 * `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual effects`,
	 * `lighting`, and `editing` (if there are people for those crew positions). Each of those
	 * members will have a `jobs` array and a standard `movie` object.
	 *
	 * @summary Get movie credits
	 */
	getPeopleMovies(
		metadata: types.GetPeopleMoviesMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleMoviesResponse200>> {
		return this.core.fetch('/people/{id}/movies', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns all shows where this person is in the `cast` or `crew`, including the
	 * `episode_count` for which they appear. Each `cast` object will have a `characters` array
	 * and a standard `show` object. If `series_regular` is `true`, this person is a series
	 * regular and not simply a guest star.
	 *
	 * The `crew` object will be broken up by department into `production`, `art`, `crew`,
	 * `costume & make-up`, `directing`, `writing`, `sound`, `camera`, `visual effects`,
	 * `lighting`, `editing`, and `created  by` (if there are people for those crew positions).
	 * Each of those members will have a `jobs` array and a standard `show` object.
	 *
	 * @summary Get show credits
	 */
	getPeopleShows(
		metadata: types.GetPeopleShowsMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleShowsResponse200>> {
		return this.core.fetch('/people/{id}/shows', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination 😁 Emojis
	 *
	 * Returns all lists that contain this person. By default, `personal` lists are returned
	 * sorted by the most `popular`.
	 *
	 * @summary Get lists containing this person
	 */
	getPeopleLists(
		metadata: types.GetPeopleListsMetadataParam
	): Promise<FetchResponse<200, types.GetPeopleListsResponse200>> {
		return this.core.fetch('/people/{id}/lists/{type}/{sort}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a person for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per person.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another person on Trakt |
	 * | `remove` | Should be removed from Trakt |
	 * | `data_refresh` | Request a full metadata refresh |
	 * | `metadata` | Metadata is wrong (name, biography, etc) |
	 * | `adult` | Marked as adult when it shouldn't be (or vice versa) |
	 * | `language` | Not in English |
	 * | `spam` | Spam or fake person |
	 * | `tmdb` | Should use TMDB as the datasource |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a person
	 * @throws FetchError<400, types.PostPeopleReportResponse400> 400
	 * @throws FetchError<409, types.PostPeopleReportResponse409> 409
	 */
	postPeopleReport(
		body: types.PostPeopleReportBodyParam,
		metadata: types.PostPeopleReportMetadataParam
	): Promise<FetchResponse<201, types.PostPeopleReportResponse201>> {
		return this.core.fetch('/people/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔥 VIP Only 🔒 OAuth Required
	 * Queue a full metadata refresh for a person. Pass `images=true` to also refresh the
	 * person's images.
	 *
	 * @summary Refresh person metadata
	 */
	postPeopleRefresh(
		metadata: types.PostPeopleRefreshMetadataParam
	): Promise<FetchResponse<201, types.PostPeopleRefreshResponse201>> {
		return this.core.fetch('/people/{id}/refresh', 'post', metadata);
	}

	/**
	 * #### 🫣 Limited Access
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns all watch now sources supported by Trakt, including provider metadata used by
	 * watch now routes.
	 *
	 * @summary Get watch now sources
	 */
	getWatchnowSourcesAll(): Promise<FetchResponse<200, types.GetWatchnowSourcesAllResponse200>> {
		return this.core.fetch('/watchnow/sources', 'get');
	}

	/**
	 * #### 🫣 Limited Access
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns watch now sources available in a country. Use the `countryCode` path parameter
	 * to request country-specific provider metadata.
	 *
	 * @summary Get watch now sources by country
	 */
	getWatchnowSourcesCountry(
		metadata: types.GetWatchnowSourcesCountryMetadataParam
	): Promise<FetchResponse<200, types.GetWatchnowSourcesCountryResponse200>> {
		return this.core.fetch('/watchnow/sources/{countryCode}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a season for moderator review. Send a reason and optional message in the request
	 * body; duplicate pending reports return `409`.
	 *
	 * @summary Report a season
	 * @throws FetchError<400, types.PostSeasonsReportResponse400> 400
	 * @throws FetchError<409, types.PostSeasonsReportResponse409> 409
	 */
	postSeasonsReport(
		body: types.PostSeasonsReportBodyParam,
		metadata: types.PostSeasonsReportMetadataParam
	): Promise<FetchResponse<201, types.PostSeasonsReportResponse201>> {
		return this.core.fetch('/seasons/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🫣 Limited Access ✨ Extended Info
	 * This endpoint is documented for visibility, but access is currently limited and may not
	 * be available to all API consumers.
	 *
	 * Returns streaming and watch now sources for an episode in the requested country. Use
	 * `links` to include provider links when available.
	 *
	 * @summary Get episode watch now sources
	 */
	getEpisodesWatchnow(
		metadata: types.GetEpisodesWatchnowMetadataParam
	): Promise<FetchResponse<200, types.GetEpisodesWatchnowResponse200>> {
		return this.core.fetch('/episodes/{id}/watchnow/{country}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report an episode for moderator review. Send a reason and optional message in the
	 * request body; duplicate pending reports return `409`.
	 *
	 * @summary Report an episode
	 * @throws FetchError<400, types.PostEpisodesReportResponse400> 400
	 * @throws FetchError<409, types.PostEpisodesReportResponse409> 409
	 */
	postEpisodesReport(
		body: types.PostEpisodesReportBodyParam,
		metadata: types.PostEpisodesReportMetadataParam
	): Promise<FetchResponse<201, types.PostEpisodesReportResponse201>> {
		return this.core.fetch('/episodes/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns trending lists ordered by current activity. Use pagination and filters to
	 * control the result set.
	 *
	 * @summary Get trending lists
	 */
	getListsTrending(
		metadata?: types.GetListsTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetListsTrendingResponse200>> {
		return this.core.fetch('/lists/trending', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns trending lists ordered by current activity. Use `type`, pagination, and filters
	 * to control the result set.
	 *
	 * @summary Get trending lists
	 */
	getListsTrendingByType(
		metadata: types.GetListsTrendingByTypeMetadataParam
	): Promise<FetchResponse<200, types.GetListsTrendingByTypeResponse200>> {
		return this.core.fetch('/lists/trending/{type}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns popular lists ordered by long-term activity. Use pagination and filters to
	 * control the result set.
	 *
	 * @summary Get popular lists
	 */
	getListsPopular(
		metadata?: types.GetListsPopularMetadataParam
	): Promise<FetchResponse<200, types.GetListsPopularResponse200>> {
		return this.core.fetch('/lists/popular', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns popular lists ordered by long-term activity. Use `type`, pagination, and filters
	 * to control the result set.
	 *
	 * @summary Get popular lists
	 */
	getListsPopularByType(
		metadata: types.GetListsPopularByTypeMetadataParam
	): Promise<FetchResponse<200, types.GetListsPopularByTypeResponse200>> {
		return this.core.fetch('/lists/popular/{type}', 'get', metadata);
	}

	/**
	 * #### 😁 Emojis
	 * Returns a single list. Use the [**\/lists/:id/items**](#reference/lists/list-items)
	 * method to get the actual items this list contains.
	 *
	 * > ### Note
	 * > _You must use an integer `id`, and only public lists will return data._
	 *
	 * @summary Get list
	 */
	getListsSummary(
		metadata: types.GetListsSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetListsSummaryResponse200>> {
		return this.core.fetch('/lists/{id}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns movie items on a public list. Use `id` to identify the list and query sorting,
	 * filters, and pagination to control the result set.
	 *
	 * @summary Get movie list items
	 */
	getListsItemsMovie(
		metadata: types.GetListsItemsMovieMetadataParam
	): Promise<FetchResponse<200, types.GetListsItemsMovieResponse200>> {
		return this.core.fetch('/lists/{id}/items/movie', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns show items on a public list. Use `id` to identify the list and query sorting,
	 * filters, and pagination to control the result set.
	 *
	 * @summary Get show list items
	 */
	getListsItemsShow(
		metadata: types.GetListsItemsShowMetadataParam
	): Promise<FetchResponse<200, types.GetListsItemsShowResponse200>> {
		return this.core.fetch('/lists/{id}/items/show', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns movie and show items on a public list. Use `id` to identify the list and query
	 * sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get media list items
	 */
	getListsItemsMedia(
		metadata: types.GetListsItemsMediaMetadataParam
	): Promise<FetchResponse<200, types.GetListsItemsMediaResponse200>> {
		return this.core.fetch('/lists/{id}/items/movie,show', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
	 * Returns movie, show, episode, and season items on a public list. Use `id` to identify
	 * the list and query sorting, filters, and pagination to control the result set.
	 *
	 * @summary Get all list items
	 */
	getListsItemsAll(
		metadata: types.GetListsItemsAllMetadataParam
	): Promise<FetchResponse<200, types.GetListsItemsAllResponse200>> {
		return this.core.fetch('/lists/{id}/items/movie,show,episode,season', 'get', metadata);
	}

	/**
	 * #### 🔥 VIP Enhanced 📄 Pagination Optional ✨ Extended Info 😁 Emojis
	 * Get all items on a personal list. Items can be a `movie`, `show`, `season`, `episode`,
	 * or `person`. You can optionally specify the `type` parameter with a single value or
	 * comma delimited string for multiple item types.
	 *
	 * @summary Get items on a list
	 */
	getListsItemsTypedSorted(
		metadata: types.GetListsItemsTypedSortedMetadataParam
	): Promise<FetchResponse<200, types.GetListsItemsTypedSortedResponse200>> {
		return this.core.fetch('/lists/{id}/items/{type}/{sort_by}/{sort_how}', 'get', metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all top level comments for a list. By default, comments are sorted by most
	 * `likes`. Other sorting options include `likes_30`, most `replies`, `replies_30`, most
	 * `plays`, highest `rating`, and `added` date.
	 *
	 * > ### Note
	 * > _If you send OAuth, comments from blocked users will be automatically filtered out._
	 *
	 * @summary Get all list comments
	 */
	getListsComments(
		metadata: types.GetListsCommentsMetadataParam
	): Promise<FetchResponse<200, types.GetListsCommentsResponse200>> {
		return this.core.fetch('/lists/{id}/comments/{sort}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination
	 * Returns all users who liked a list.
	 *
	 * @summary Get all users who liked a list
	 */
	getListsLikes(
		metadata: types.GetListsLikesMetadataParam
	): Promise<FetchResponse<200, types.GetListsLikesResponse200>> {
		return this.core.fetch('/lists/{id}/likes', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Votes help determine popular lists. Only one like is allowed per list per user.
	 *
	 * @summary Like a list
	 */
	postListsLike(
		metadata: types.PostListsLikeMetadataParam
	): Promise<FetchResponse<204, types.PostListsLikeResponse204>> {
		return this.core.fetch('/lists/{id}/like', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a like on a list.
	 *
	 * @summary Remove like on a list
	 */
	deleteListsUnlike(
		metadata: types.DeleteListsUnlikeMetadataParam
	): Promise<FetchResponse<204, types.DeleteListsUnlikeResponse204>> {
		return this.core.fetch('/lists/{id}/like', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a list for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per list.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `duplicate` | Duplicate of another list |
	 * | `remove` | Should be removed from Trakt |
	 * | `metadata` | Metadata is wrong (name, description, etc) |
	 * | `adult` | Contains adult content |
	 * | `language` | Not in English |
	 * | `spam` | Spam or self-promotion |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a list
	 * @throws FetchError<400, types.PostListsReportResponse400> 400
	 * @throws FetchError<409, types.PostListsReportResponse409> 409
	 */
	postListsReport(
		body: types.PostListsReportBodyParam,
		metadata: types.PostListsReportMetadataParam
	): Promise<FetchResponse<201, types.PostListsReportResponse201>> {
		return this.core.fetch('/lists/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 😁 Emojis
	 * Returns a single comment and indicates how many replies it has. Use
	 * [**\/comments/:id/replies**](/reference/comments/replies/) to get the actual replies.
	 *
	 * @summary Get a comment or reply
	 */
	getCommentsSummary(
		metadata: types.GetCommentsSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsSummaryResponse200>> {
		return this.core.fetch('/comments/{id}', 'get', metadata);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns the media item this comment is attached to. The media type can be `movie`,
	 * `show`, `season`, `episode`, or `list` and it also returns the standard media object for
	 * that media type.
	 *
	 * @summary Get the attached media item
	 */
	getCommentsItem(
		metadata: types.GetCommentsItemMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsItemResponse200>> {
		return this.core.fetch('/comments/{id}/item', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination
	 * Returns all users who liked a comment. If you only need the `replies` count, the main
	 * `comment` object already has that, so no need to use this method.
	 *
	 * @summary Get all users who liked a comment
	 */
	getCommentsLikes(
		metadata: types.GetCommentsLikesMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsLikesResponse200>> {
		return this.core.fetch('/comments/{id}/likes', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Votes help determine popular comments. Only one like is allowed per comment per user.
	 *
	 * @summary Like a comment
	 */
	postCommentsLike(
		metadata: types.PostCommentsLikeMetadataParam
	): Promise<FetchResponse<204, types.PostCommentsLikeResponse204>> {
		return this.core.fetch('/comments/{id}/like', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a like on a comment.
	 *
	 * @summary Remove like on a comment
	 */
	deleteCommentsUnlike(
		metadata: types.DeleteCommentsUnlikeMetadataParam
	): Promise<FetchResponse<204, types.DeleteCommentsUnlikeResponse204>> {
		return this.core.fetch('/comments/{id}/like', 'delete', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Report a comment for moderator review. Send a `reason` and optional `message` with
	 * additional context. A user can only have one `pending` report per comment.
	 *
	 * | reason | description |
	 * |---|---|
	 * | `spoilers` | Contains spoilers |
	 * | `language` | Not in English |
	 * | `abusive` | Harassment or abusive behavior |
	 * | `spam` | Spam or self-promotion |
	 * | `bigotry` | Bigotry, hate speech, or discrimination |
	 * | `political` | Political attack |
	 * | `offtopic` | Off topic |
	 * | `support` | Support question |
	 * | `duplicate` | Duplicate comment |
	 * | `too_short` | Too short to be useful |
	 * | `other` | Anything else (add details in `message`) |
	 *
	 * @summary Report a comment
	 * @throws FetchError<400, types.PostCommentsReportResponse400> 400
	 * @throws FetchError<409, types.PostCommentsReportResponse409> 409
	 */
	postCommentsReport(
		body: types.PostCommentsReportBodyParam,
		metadata: types.PostCommentsReportMetadataParam
	): Promise<FetchResponse<201, types.PostCommentsReportResponse201>> {
		return this.core.fetch('/comments/{id}/report', 'post', body, metadata);
	}

	/**
	 * #### 🔓 OAuth Optional 📄 Pagination 😁 Emojis
	 *
	 * Returns all replies for a comment. It is possible these replies could have replies
	 * themselves, so in that case you would just call
	 * [**\/comments/:id/replies**](/reference/comments/replies/) again with the new comment
	 * `id`.
	 *
	 * > ### Note
	 * > _If you send OAuth, replies from blocked users will be automatically filtered out._
	 *
	 * @summary Get replies for a comment
	 */
	getCommentsReplies(
		metadata: types.GetCommentsRepliesMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsRepliesResponse200>> {
		return this.core.fetch('/comments/{id}/replies', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 😁 Emojis
	 * Add a new reply to an existing comment. Make sure to allow and encourage *spoilers* to
	 * be indicated in your app and follow the rules listed above.
	 *
	 * > ### Note
	 * > Replies can only be added to top level comments. If you try to reply to a reply, a
	 * `404` HTTP status code is returned.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Default | Value |
	 * |---|---|---|---|
	 * | `comment` * | string |  | Text for the reply. |
	 * | `spoiler` | boolean | `false` | Is this a spoiler? |
	 *
	 * @summary Post a reply for a comment
	 */
	postCommentsReply(
		body: types.PostCommentsReplyBodyParam,
		metadata: types.PostCommentsReplyMetadataParam
	): Promise<FetchResponse<201, types.PostCommentsReplyResponse201>> {
		return this.core.fetch('/comments/{id}/replies', 'post', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required 😁 Emojis
	 * Update a single comment. The OAuth user must match the author of the comment in order to
	 * update it. If not, a `401` HTTP status is returned.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Default | Value |
	 * |---|---|---|---|
	 * | `comment` | string |  | Text for the comment. |
	 * | `spoiler` | boolean | `false` | Is this a spoiler? |
	 *
	 * @summary Update a comment or reply
	 */
	putCommentsEdit(
		body: types.PutCommentsEditBodyParam,
		metadata: types.PutCommentsEditMetadataParam
	): Promise<FetchResponse<200, types.PutCommentsEditResponse200>> {
		return this.core.fetch('/comments/{id}/', 'put', body, metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Delete a single comment. The OAuth user must match the author of the comment in order to
	 * delete it. If not, a `401` HTTP status code is returned. The comment must also be less
	 * than 2 weeks old or have 0 replies. If not, a `409` HTTP status is returned.
	 *
	 * @summary Delete a comment or reply
	 */
	deleteCommentsDelete(
		metadata: types.DeleteCommentsDeleteMetadataParam
	): Promise<FetchResponse<204, types.DeleteCommentsDeleteResponse204>> {
		return this.core.fetch('/comments/{id}/', 'delete', metadata);
	}

	/**
	 * Returns reaction totals for a comment, grouped by reaction type.
	 *
	 * @summary Get reaction summary
	 */
	getCommentsReactionsSummary(
		metadata: types.GetCommentsReactionsSummaryMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsReactionsSummaryResponse200>> {
		return this.core.fetch('/comments/{id}/reactions/summary', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info
	 * Returns users and reaction details for every reaction on a comment. Use pagination and
	 * `extended` to control the response.
	 *
	 * @summary Get comment reactions
	 */
	getCommentsReactionsAll(
		metadata: types.GetCommentsReactionsAllMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsReactionsAllResponse200>> {
		return this.core.fetch('/comments/{id}/reactions/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Add a reaction to a comment. Use `reaction_type` to choose the reaction; a successful
	 * create returns `201` with no response body.
	 *
	 * @summary Add comment reaction
	 */
	postCommentsReactionsAdd(
		metadata: types.PostCommentsReactionsAddMetadataParam
	): Promise<FetchResponse<201, types.PostCommentsReactionsAddResponse201>> {
		return this.core.fetch('/comments/{id}/reactions/{reaction_type}', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Remove a reaction from a comment. Use `reaction_type` to choose the reaction; a
	 * successful delete returns `204` with no response body.
	 *
	 * @summary Remove comment reaction
	 */
	deleteCommentsReactionsRemove(
		metadata: types.DeleteCommentsReactionsRemoveMetadataParam
	): Promise<FetchResponse<204, types.DeleteCommentsReactionsRemoveResponse204>> {
		return this.core.fetch('/comments/{id}/reactions/{reaction_type}', 'delete', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 😁 Emojis
	 * Returns all comments with the most likes and replies over the last 7 days. You can
	 * optionally filter by the `comment_type` and media `type` to limit what gets returned. If
	 * you want to `include_replies` that will return replies in place alongside top level
	 * comments.
	 *
	 * @summary Get trending comments
	 */
	getCommentsTrending(
		metadata: types.GetCommentsTrendingMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsTrendingResponse200>> {
		return this.core.fetch('/comments/trending/{comment_type}/{type}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 😁 Emojis
	 * Returns the most recently written comments across all of Trakt. You can optionally
	 * filter by the `comment_type` and media `type` to limit what gets returned. If you want
	 * to `include_replies` that will return replies in place alongside top level comments.
	 *
	 * @summary Get recently created comments
	 */
	getCommentsRecent(
		metadata: types.GetCommentsRecentMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsRecentResponse200>> {
		return this.core.fetch('/comments/recent/{comment_type}/{type}', 'get', metadata);
	}

	/**
	 * #### 📄 Pagination ✨ Extended Info 😁 Emojis
	 * Returns the most recently updated comments across all of Trakt. You can optionally
	 * filter by the `comment_type` and media `type` to limit what gets returned. If you want
	 * to `include_replies` that will return replies in place alongside top level comments.
	 *
	 * @summary Get recently updated comments
	 */
	getCommentsUpdates(
		metadata: types.GetCommentsUpdatesMetadataParam
	): Promise<FetchResponse<200, types.GetCommentsUpdatesResponse200>> {
		return this.core.fetch('/comments/updates/{comment_type}/{type}', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required 😁 Emojis
	 * Add a new comment to a movie, show, season, episode, or list. Make sure to allow and
	 * encourage *spoilers* to be indicated in your app and follow the rules listed above.
	 *
	 * #### JSON POST Data
	 * | Key | Type | Default | Value |
	 * |---|---|---|---|
	 * | item * | object | | `movie`, `show`, `season`, `episode`, or `list` object. (see
	 * examples ->) |
	 * | `comment` * | string |  | Text for the comment. |
	 * | `spoiler` | boolean | `false` | Is this a spoiler? |
	 * | `sharing`  | object | | Control sharing to any connected social networks. (see below
	 * &#8595;) |
	 *
	 * #### Sharing
	 * The `sharing` object is optional and will apply the user's settings if not sent. If
	 * `sharing` is sent, each key will override the user's setting for that social network.
	 * Send `true` to post or `false` to not post on the indicated social network. You can see
	 * which social networks a user has connected with the
	 * [**\/users/settings**](/reference/users/settings) method.
	 *
	 * | Key | Type |
	 * |---|---|
	 * | `twitter` | boolean |
	 * | `tumblr` | boolean |
	 * | `medium` | boolean |
	 *
	 * @summary Post a comment
	 */
	postCommentsPost(
		body: types.PostCommentsPostBodyParam
	): Promise<FetchResponse<201, types.PostCommentsPostResponse201>> {
		return this.core.fetch('/comments/', 'post', body);
	}

	/**
	 * Get a list of all certifications, including names, slugs, and descriptions.
	 *
	 * @summary Get certifications
	 */
	getCertificationsList(
		metadata: types.GetCertificationsListMetadataParam
	): Promise<FetchResponse<200, types.GetCertificationsListResponse200>> {
		return this.core.fetch('/certifications/{type}', 'get', metadata);
	}

	/**
	 * Returns show certifications grouped by country, including certification name, slug, and
	 * description.
	 *
	 * @summary Get show certifications
	 */
	getCertificationsShows(): Promise<FetchResponse<200, types.GetCertificationsShowsResponse200>> {
		return this.core.fetch('/certifications/shows', 'get');
	}

	/**
	 * Returns movie certifications grouped by country, including certification name, slug, and
	 * description.
	 *
	 * @summary Get movie certifications
	 */
	getCertificationsMovies(): Promise<FetchResponse<200, types.GetCertificationsMoviesResponse200>> {
		return this.core.fetch('/certifications/movies', 'get');
	}

	/**
	 * Get a list of all countries, including names and codes.
	 *
	 * @summary Get countries
	 */
	getCountriesList(
		metadata: types.GetCountriesListMetadataParam
	): Promise<FetchResponse<200, types.GetCountriesListResponse200>> {
		return this.core.fetch('/countries/{type}', 'get', metadata);
	}

	/**
	 * Get a list of all genres, including names and slugs.
	 *
	 * #### Subgenres
	 *
	 * Send `?extended=subgenres` to get a list of subgenres for each genre. You can get more
	 * creative with advanced filters by using the subgenres in your app.
	 *
	 * @summary Get genres
	 */
	getGenresList(
		metadata: types.GetGenresListMetadataParam
	): Promise<FetchResponse<200, types.GetGenresListResponse200>> {
		return this.core.fetch('/genres/{type}', 'get', metadata);
	}

	/**
	 * Get a list of all languages, including names and codes.
	 *
	 * @summary Get languages
	 */
	getLanguagesList(
		metadata: types.GetLanguagesListMetadataParam
	): Promise<FetchResponse<200, types.GetLanguagesListResponse200>> {
		return this.core.fetch('/languages/{type}', 'get', metadata);
	}

	/**
	 * Get a list of all TV networks, including names.
	 *
	 * @summary Get networks
	 */
	getNetworksList(): Promise<FetchResponse<200, types.GetNetworksListResponse200>> {
		return this.core.fetch('/networks', 'get');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Use this method when the video initially starts playing or is unpaused. This will remove
	 * any playback progress if it exists.
	 *
	 * > ### Note
	 * > _A watching status will auto expire after the remaining runtime has elapsed. There is
	 * no need to call this method again while continuing to watch the same item._
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | item * | object | `movie` or `episode` object. (see examples ->) |
	 * | `progress` * | float | Progress percentage between 0 and 100. |
	 *
	 * @summary Start watching in a media center
	 */
	postScrobbleStart(
		body?: types.PostScrobbleStartBodyParam
	): Promise<FetchResponse<201, types.PostScrobbleStartResponse201>> {
		return this.core.fetch('/scrobble/start', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Pause an active scrobble for a movie or episode. Send the media object and current
	 * progress in the request body; the response returns the updated scrobble state.
	 *
	 * @summary Pause watching in a media center
	 */
	postScrobblePause(
		body?: types.PostScrobblePauseBodyParam
	): Promise<FetchResponse<201, types.PostScrobblePauseResponse201>> {
		return this.core.fetch('/scrobble/pause', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Use this method when the video is stopped or finishes playing on its own. If the
	 * progress is above 80%, the video will be scrobbled and the `action` will be set to
	 * **scrobble**. A unique history `id` (64-bit integer) will be returned and can be used to
	 * reference this `scrobble` directly.
	 *
	 * If the progress is between 1% and 79%, it will be treated as a *pause* and the `action`
	 * will be set to **pause**. The playback progress will be saved and
	 * [**\/sync/playback**](/reference/sync/playback/) can be used to resume the video from
	 * this exact position.
	 *
	 * > ### Note
	 * > _If the progress is less than 1%, you'll get a `422` HTTP status code response and the
	 * scrobble will be ignored._
	 *
	 * #### JSON POST Data
	 * | Key | Type | Value |
	 * |---|---|---|
	 * | item * | object | `movie` or `episode` object. (see examples ->) |
	 * | `progress` * | flloat | Progress percentage between 0 and 100. |
	 *
	 * > ### Note
	 * > _If the same item was just scrobbled, a `409` HTTP status code will returned to avoid
	 * scrobbling a duplicate. The response will contain a `watched_at` timestamp when the item
	 * was last scrobbled and a `expires_at` timestamp when the item can be scrobbled again._
	 *
	 * @summary Stop or finish watching in a media center
	 */
	postScrobbleStop(
		body?: types.PostScrobbleStopBodyParam
	): Promise<FetchResponse<201, types.PostScrobbleStopResponse201>> {
		return this.core.fetch('/scrobble/stop', 'post', body);
	}

	/**
	 * #### ✨ Extended Info
	 * Returns Trakt team members. Use `extended` to include additional person details and
	 * images when available.
	 *
	 * @summary Get team members
	 */
	getTeamMembers(
		metadata?: types.GetTeamMembersMetadataParam
	): Promise<FetchResponse<200, types.GetTeamMembersResponse200>> {
		return this.core.fetch('/team/', 'get', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Lists every connectable streaming service with the current user's connection status
	 * merged in, so a settings grid can render each tile in one pass. Read-only — never
	 * creates a remote younify user.
	 *
	 * > ### IMPORTANT
	 * > _**Array order is significant.** Clients must preserve the response order when
	 * rendering the grid; the list is returned in the intended display order._
	 *
	 * `vip: false` is the free tier. `connectable` reflects whether the current user may
	 * connect the service on their plan. `connected` plus `active` indicate a healthy link
	 * (`active: false` is a broken link). `profile` and `last_synced_at` are null when not
	 * connected, and `last_synced_at` is normalized to `.000Z`.
	 *
	 * @summary Get streaming connections
	 */
	getYounifyConnections(): Promise<FetchResponse<200, types.GetYounifyConnectionsResponse200>> {
		return this.core.fetch('/younify/connections', 'get');
	}

	/**
	 * #### 🔒 OAuth Required
	 * Mints a signed younify web-auth URL for the client to open. Accepts the client's own
	 * `return_url` (deep link / universal link), validated against trakt-owned destinations
	 * only (`trakt://…` or `https://\*.trakt.tv`).
	 *
	 * A `422` is returned when the service is not connectable on the user's plan, and a `400`
	 * when the `return_url` is missing/invalid or no URL could be minted.
	 *
	 * @summary Create a streaming connection
	 * @throws FetchError<400, types.PostYounifyConnectResponse400> 400
	 * @throws FetchError<422, types.PostYounifyConnectResponse422> 422
	 */
	postYounifyConnect(
		body: types.PostYounifyConnectBodyParam
	): Promise<FetchResponse<200, types.PostYounifyConnectResponse200>> {
		return this.core.fetch('/younify/connect', 'post', body);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Queue / force a re-sync of a connected streaming service for the authenticated user.
	 *
	 * @summary Refresh a streaming service
	 */
	postYounifyRefresh(
		metadata: types.PostYounifyRefreshMetadataParam
	): Promise<FetchResponse<204, types.PostYounifyRefreshResponse204>> {
		return this.core.fetch('/younify/users/refresh/{service_id}', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Queue / force a re-sync of a connected streaming service for the authenticated user. The
	 * trailing `all_data` segment forces a full re-sync of all data rather than an incremental
	 * one.
	 *
	 * @summary Refresh a streaming service (full re-sync)
	 */
	postYounifyRefreshAll(
		metadata: types.PostYounifyRefreshAllMetadataParam
	): Promise<FetchResponse<204, types.PostYounifyRefreshAllResponse204>> {
		return this.core.fetch('/younify/users/refresh/{service_id}/{all_data}', 'post', metadata);
	}

	/**
	 * #### 🔒 OAuth Required
	 * Unlink a streaming service from the authenticated user.
	 *
	 * @summary Unlink a streaming service
	 */
	deleteYounifyDisconnect(
		metadata: types.DeleteYounifyDisconnectMetadataParam
	): Promise<FetchResponse<204, types.DeleteYounifyDisconnectResponse204>> {
		return this.core.fetch('/younify/users/services/{service_id}', 'delete', metadata);
	}
}

const createSDK = (() => {
	return new SDK();
})();

export default createSDK;

export type {
	DeleteCheckinDeleteResponse204,
	DeleteCommentsDeleteMetadataParam,
	DeleteCommentsDeleteResponse204,
	DeleteCommentsReactionsRemoveMetadataParam,
	DeleteCommentsReactionsRemoveResponse204,
	DeleteCommentsUnlikeMetadataParam,
	DeleteCommentsUnlikeResponse204,
	DeleteListsUnlikeMetadataParam,
	DeleteListsUnlikeResponse204,
	DeleteNotesDeleteMetadataParam,
	DeleteNotesDeleteResponse204,
	DeleteRecommendationsMoviesHideMetadataParam,
	DeleteRecommendationsMoviesHideResponse204,
	DeleteRecommendationsShowsHideMetadataParam,
	DeleteRecommendationsShowsHideResponse204,
	DeleteShowsProgressUndoResetMetadataParam,
	DeleteShowsProgressUndoResetResponse204,
	DeleteSyncProgressDropMovieMetadataParam,
	DeleteSyncProgressDropMovieResponse204,
	DeleteUsersFiltersDeleteMetadataParam,
	DeleteUsersFiltersDeleteResponse204,
	DeleteUsersFiltersDeleteResponse404,
	DeleteUsersListsListDeleteMetadataParam,
	DeleteUsersListsListDeleteResponse204,
	DeleteUsersListsListDeleteResponse403,
	DeleteUsersListsListUnlikeMetadataParam,
	DeleteUsersListsListUnlikeResponse204,
	DeleteUsersPlexDisconnectResponse204,
	DeleteUsersRequestsDenyMetadataParam,
	DeleteUsersRequestsDenyResponse204,
	DeleteUsersRequestsDenyResponse404,
	DeleteUsersSyncsUndoMetadataParam,
	DeleteUsersSyncsUndoResponse204,
	DeleteUsersSyncsUndoResponse404,
	DeleteUsersUnblockMetadataParam,
	DeleteUsersUnblockResponse204,
	DeleteUsersUnfollowMetadataParam,
	DeleteUsersUnfollowResponse204,
	DeleteYounifyDisconnectMetadataParam,
	DeleteYounifyDisconnectResponse204,
	GetCalendarsDvdReleasesMetadataParam,
	GetCalendarsDvdReleasesResponse200,
	GetCalendarsFinalesMetadataParam,
	GetCalendarsFinalesResponse200,
	GetCalendarsMoviesMetadataParam,
	GetCalendarsMoviesResponse200,
	GetCalendarsNewShowsMetadataParam,
	GetCalendarsNewShowsResponse200,
	GetCalendarsSeasonPremieresMetadataParam,
	GetCalendarsSeasonPremieresResponse200,
	GetCalendarsShowsMetadataParam,
	GetCalendarsShowsResponse200,
	GetCalendarsStreamingMetadataParam,
	GetCalendarsStreamingResponse200,
	GetCertificationsListMetadataParam,
	GetCertificationsListResponse200,
	GetCertificationsMoviesResponse200,
	GetCertificationsShowsResponse200,
	GetCommentsItemMetadataParam,
	GetCommentsItemResponse200,
	GetCommentsLikesMetadataParam,
	GetCommentsLikesResponse200,
	GetCommentsReactionsAllMetadataParam,
	GetCommentsReactionsAllResponse200,
	GetCommentsReactionsSummaryMetadataParam,
	GetCommentsReactionsSummaryResponse200,
	GetCommentsRecentMetadataParam,
	GetCommentsRecentResponse200,
	GetCommentsRepliesMetadataParam,
	GetCommentsRepliesResponse200,
	GetCommentsSummaryMetadataParam,
	GetCommentsSummaryResponse200,
	GetCommentsTrendingMetadataParam,
	GetCommentsTrendingResponse200,
	GetCommentsUpdatesMetadataParam,
	GetCommentsUpdatesResponse200,
	GetCountriesListMetadataParam,
	GetCountriesListResponse200,
	GetEpisodesWatchnowMetadataParam,
	GetEpisodesWatchnowResponse200,
	GetGenresListMetadataParam,
	GetGenresListResponse200,
	GetLanguagesListMetadataParam,
	GetLanguagesListResponse200,
	GetListsCommentsMetadataParam,
	GetListsCommentsResponse200,
	GetListsItemsAllMetadataParam,
	GetListsItemsAllResponse200,
	GetListsItemsMediaMetadataParam,
	GetListsItemsMediaResponse200,
	GetListsItemsMovieMetadataParam,
	GetListsItemsMovieResponse200,
	GetListsItemsShowMetadataParam,
	GetListsItemsShowResponse200,
	GetListsItemsTypedSortedMetadataParam,
	GetListsItemsTypedSortedResponse200,
	GetListsLikesMetadataParam,
	GetListsLikesResponse200,
	GetListsPopularByTypeMetadataParam,
	GetListsPopularByTypeResponse200,
	GetListsPopularMetadataParam,
	GetListsPopularResponse200,
	GetListsSummaryMetadataParam,
	GetListsSummaryResponse200,
	GetListsTrendingByTypeMetadataParam,
	GetListsTrendingByTypeResponse200,
	GetListsTrendingMetadataParam,
	GetListsTrendingResponse200,
	GetMediaAnticipatedMetadataParam,
	GetMediaAnticipatedResponse200,
	GetMediaPopularMetadataParam,
	GetMediaPopularResponse200,
	GetMediaTrendingMetadataParam,
	GetMediaTrendingResponse200,
	GetMoviesAliasesMetadataParam,
	GetMoviesAliasesResponse200,
	GetMoviesAnticipatedMetadataParam,
	GetMoviesAnticipatedResponse200,
	GetMoviesBoxofficeMetadataParam,
	GetMoviesBoxofficeResponse200,
	GetMoviesCollectedMetadataParam,
	GetMoviesCollectedResponse200,
	GetMoviesCommentsMetadataParam,
	GetMoviesCommentsResponse200,
	GetMoviesFavoritedMetadataParam,
	GetMoviesFavoritedResponse200,
	GetMoviesHotMetadataParam,
	GetMoviesHotResponse200,
	GetMoviesJustwatchLinkMetadataParam,
	GetMoviesJustwatchLinkResponse200,
	GetMoviesListsMetadataParam,
	GetMoviesListsResponse200,
	GetMoviesPeopleMetadataParam,
	GetMoviesPeopleResponse200,
	GetMoviesPlayedMetadataParam,
	GetMoviesPlayedResponse200,
	GetMoviesPopularMetadataParam,
	GetMoviesPopularResponse200,
	GetMoviesRatingsMetadataParam,
	GetMoviesRatingsResponse200,
	GetMoviesRelatedMetadataParam,
	GetMoviesRelatedResponse200,
	GetMoviesReleasesMetadataParam,
	GetMoviesReleasesResponse200,
	GetMoviesSentimentsMetadataParam,
	GetMoviesSentimentsResponse200,
	GetMoviesStatsMetadataParam,
	GetMoviesStatsResponse200,
	GetMoviesStreamingMetadataParam,
	GetMoviesStreamingResponse200,
	GetMoviesStudiosMetadataParam,
	GetMoviesStudiosResponse200,
	GetMoviesSummaryMetadataParam,
	GetMoviesSummaryResponse200,
	GetMoviesTranslationsMetadataParam,
	GetMoviesTranslationsResponse200,
	GetMoviesTrendingMetadataParam,
	GetMoviesTrendingResponse200,
	GetMoviesUpdatedIdsMetadataParam,
	GetMoviesUpdatedIdsResponse200,
	GetMoviesUpdatesMetadataParam,
	GetMoviesUpdatesResponse200,
	GetMoviesVideosMetadataParam,
	GetMoviesVideosResponse200,
	GetMoviesWatchedMetadataParam,
	GetMoviesWatchedResponse200,
	GetMoviesWatchingMetadataParam,
	GetMoviesWatchingResponse200,
	GetMoviesWatchnowMetadataParam,
	GetMoviesWatchnowResponse200,
	GetNetworksListResponse200,
	GetNotesItemMetadataParam,
	GetNotesItemResponse200,
	GetNotesSummaryMetadataParam,
	GetNotesSummaryResponse200,
	GetOauthAuthorizeMetadataParam,
	GetOauthAuthorizeResponse200,
	GetPeopleListsMetadataParam,
	GetPeopleListsResponse200,
	GetPeopleMoviesMetadataParam,
	GetPeopleMoviesResponse200,
	GetPeopleShowsMetadataParam,
	GetPeopleShowsResponse200,
	GetPeopleSummaryMetadataParam,
	GetPeopleSummaryResponse200,
	GetPeopleUpdatedIdsMetadataParam,
	GetPeopleUpdatedIdsResponse200,
	GetPeopleUpdatesMetadataParam,
	GetPeopleUpdatesResponse200,
	GetRecommendationsMoviesRecommendMetadataParam,
	GetRecommendationsMoviesRecommendResponse200,
	GetRecommendationsShowsRecommendMetadataParam,
	GetRecommendationsShowsRecommendResponse200,
	GetSearchExactMetadataParam,
	GetSearchExactResponse200,
	GetSearchLookupMetadataParam,
	GetSearchLookupResponse200,
	GetSearchQueryMetadataParam,
	GetSearchQueryResponse200,
	GetSearchTrendingMetadataParam,
	GetSearchTrendingResponse200,
	GetShowsAliasesMetadataParam,
	GetShowsAliasesResponse200,
	GetShowsAnticipatedMetadataParam,
	GetShowsAnticipatedResponse200,
	GetShowsCertificationsMetadataParam,
	GetShowsCertificationsResponse200,
	GetShowsCollectedMetadataParam,
	GetShowsCollectedResponse200,
	GetShowsCommentsMetadataParam,
	GetShowsCommentsResponse200,
	GetShowsEpisodeCommentsMetadataParam,
	GetShowsEpisodeCommentsResponse200,
	GetShowsEpisodeListsMetadataParam,
	GetShowsEpisodeListsResponse200,
	GetShowsEpisodePeopleMetadataParam,
	GetShowsEpisodePeopleResponse200,
	GetShowsEpisodeRatingsMetadataParam,
	GetShowsEpisodeRatingsResponse200,
	GetShowsEpisodeStatsMetadataParam,
	GetShowsEpisodeStatsResponse200,
	GetShowsEpisodeSummaryMetadataParam,
	GetShowsEpisodeSummaryResponse200,
	GetShowsEpisodeTranslationsMetadataParam,
	GetShowsEpisodeTranslationsResponse200,
	GetShowsEpisodeVideosMetadataParam,
	GetShowsEpisodeVideosResponse200,
	GetShowsEpisodeWatchingMetadataParam,
	GetShowsEpisodeWatchingResponse200,
	GetShowsEpisodeWatchnowMetadataParam,
	GetShowsEpisodeWatchnowResponse200,
	GetShowsFavoritedMetadataParam,
	GetShowsFavoritedResponse200,
	GetShowsHotMetadataParam,
	GetShowsHotResponse200,
	GetShowsJustwatchLinkMetadataParam,
	GetShowsJustwatchLinkResponse200,
	GetShowsLastEpisodeMetadataParam,
	GetShowsLastEpisodeResponse200,
	GetShowsLastEpisodeResponse204,
	GetShowsListsMetadataParam,
	GetShowsListsResponse200,
	GetShowsNextEpisodeMetadataParam,
	GetShowsNextEpisodeResponse200,
	GetShowsNextEpisodeResponse204,
	GetShowsPeopleMetadataParam,
	GetShowsPeopleResponse200,
	GetShowsPlayedMetadataParam,
	GetShowsPlayedResponse200,
	GetShowsPopularMetadataParam,
	GetShowsPopularResponse200,
	GetShowsProgressCollectionMetadataParam,
	GetShowsProgressCollectionResponse200,
	GetShowsProgressWatchedMetadataParam,
	GetShowsProgressWatchedResponse200,
	GetShowsRatingsMetadataParam,
	GetShowsRatingsResponse200,
	GetShowsRelatedMetadataParam,
	GetShowsRelatedResponse200,
	GetShowsSeasonCommentsMetadataParam,
	GetShowsSeasonCommentsResponse200,
	GetShowsSeasonEpisodesMetadataParam,
	GetShowsSeasonEpisodesResponse200,
	GetShowsSeasonInfoMetadataParam,
	GetShowsSeasonInfoResponse200,
	GetShowsSeasonJustwatchLinkMetadataParam,
	GetShowsSeasonJustwatchLinkResponse200,
	GetShowsSeasonListsMetadataParam,
	GetShowsSeasonListsResponse200,
	GetShowsSeasonPeopleMetadataParam,
	GetShowsSeasonPeopleResponse200,
	GetShowsSeasonRatingsMetadataParam,
	GetShowsSeasonRatingsResponse200,
	GetShowsSeasonStatsMetadataParam,
	GetShowsSeasonStatsResponse200,
	GetShowsSeasonTranslationsMetadataParam,
	GetShowsSeasonTranslationsResponse200,
	GetShowsSeasonVideosMetadataParam,
	GetShowsSeasonVideosResponse200,
	GetShowsSeasonWatchingMetadataParam,
	GetShowsSeasonWatchingResponse200,
	GetShowsSeasonsMetadataParam,
	GetShowsSeasonsResponse200,
	GetShowsSentimentsMetadataParam,
	GetShowsSentimentsResponse200,
	GetShowsStatsMetadataParam,
	GetShowsStatsResponse200,
	GetShowsStreamingMetadataParam,
	GetShowsStreamingResponse200,
	GetShowsStudiosMetadataParam,
	GetShowsStudiosResponse200,
	GetShowsSummaryMetadataParam,
	GetShowsSummaryResponse200,
	GetShowsTranslationsMetadataParam,
	GetShowsTranslationsResponse200,
	GetShowsTrendingMetadataParam,
	GetShowsTrendingResponse200,
	GetShowsUpdatedIdsMetadataParam,
	GetShowsUpdatedIdsResponse200,
	GetShowsUpdatesMetadataParam,
	GetShowsUpdatesResponse200,
	GetShowsVideosMetadataParam,
	GetShowsVideosResponse200,
	GetShowsWatchedMetadataParam,
	GetShowsWatchedResponse200,
	GetShowsWatchingMetadataParam,
	GetShowsWatchingResponse200,
	GetShowsWatchnowMetadataParam,
	GetShowsWatchnowResponse200,
	GetSocialRecommendationsMoviesRecommendMetadataParam,
	GetSocialRecommendationsMoviesRecommendResponse200,
	GetSocialRecommendationsShowsRecommendMetadataParam,
	GetSocialRecommendationsShowsRecommendResponse200,
	GetSyncCollectionAllMetadataParam,
	GetSyncCollectionAllResponse200,
	GetSyncCollectionEpisodesMetadataParam,
	GetSyncCollectionEpisodesResponse200,
	GetSyncCollectionMediaMetadataParam,
	GetSyncCollectionMediaResponse200,
	GetSyncCollectionMinimalEpisodesMetadataParam,
	GetSyncCollectionMinimalEpisodesResponse200,
	GetSyncCollectionMinimalMoviesMetadataParam,
	GetSyncCollectionMinimalMoviesResponse200,
	GetSyncCollectionMinimalShowsMetadataParam,
	GetSyncCollectionMinimalShowsResponse200,
	GetSyncCollectionMoviesMetadataParam,
	GetSyncCollectionMoviesResponse200,
	GetSyncCollectionShowsMetadataParam,
	GetSyncCollectionShowsResponse200,
	GetSyncFavoritesGetMetadataParam,
	GetSyncFavoritesGetResponse200,
	GetSyncHistoryGetMetadataParam,
	GetSyncHistoryGetResponse200,
	GetSyncLastActivitiesResponse200,
	GetSyncProgressMoviesMetadataParam,
	GetSyncProgressMoviesResponse200,
	GetSyncProgressPlaybackMetadataParam,
	GetSyncProgressPlaybackResponse200,
	GetSyncProgressUpNextNitroMetadataParam,
	GetSyncProgressUpNextNitroResponse200,
	GetSyncProgressUpNextStandardMetadataParam,
	GetSyncProgressUpNextStandardResponse200,
	GetSyncProgressWatchedMetadataParam,
	GetSyncProgressWatchedResponse200,
	GetSyncRatingsGetMetadataParam,
	GetSyncRatingsGetResponse200,
	GetSyncWatchedMetadataParam,
	GetSyncWatchedResponse200,
	GetSyncWatchlistGetMetadataParam,
	GetSyncWatchlistGetResponse200,
	GetTeamMembersMetadataParam,
	GetTeamMembersResponse200,
	GetUsersActivitiesMetadataParam,
	GetUsersActivitiesResponse200,
	GetUsersBlockedResponse200,
	GetUsersCollectionMetadataParam,
	GetUsersCollectionResponse200,
	GetUsersCommentsMetadataParam,
	GetUsersCommentsResponse200,
	GetUsersFavoritesCommentsMetadataParam,
	GetUsersFavoritesCommentsResponse200,
	GetUsersFavoritesMediaMetadataParam,
	GetUsersFavoritesMediaResponse200,
	GetUsersFavoritesMoviesMetadataParam,
	GetUsersFavoritesMoviesResponse200,
	GetUsersFavoritesShowsMetadataParam,
	GetUsersFavoritesShowsResponse200,
	GetUsersFavoritesTypedSortedMetadataParam,
	GetUsersFavoritesTypedSortedResponse200,
	GetUsersFiltersSavedMetadataParam,
	GetUsersFiltersSavedResponse200,
	GetUsersFollowersMetadataParam,
	GetUsersFollowersResponse200,
	GetUsersFollowingMetadataParam,
	GetUsersFollowingResponse200,
	GetUsersFriendsMetadataParam,
	GetUsersFriendsResponse200,
	GetUsersHiddenDroppedMetadataParam,
	GetUsersHiddenDroppedResponse200,
	GetUsersHiddenGetBySectionMetadataParam,
	GetUsersHiddenGetBySectionResponse200,
	GetUsersHiddenGetMetadataParam,
	GetUsersHiddenGetResponse200,
	GetUsersHistoryAllMetadataParam,
	GetUsersHistoryAllResponse200,
	GetUsersHistoryEpisodeMetadataParam,
	GetUsersHistoryEpisodeResponse200,
	GetUsersHistoryEpisodesMetadataParam,
	GetUsersHistoryEpisodesResponse200,
	GetUsersHistoryMovieMetadataParam,
	GetUsersHistoryMovieResponse200,
	GetUsersHistoryMoviesMetadataParam,
	GetUsersHistoryMoviesResponse200,
	GetUsersHistoryShowMetadataParam,
	GetUsersHistoryShowResponse200,
	GetUsersHistoryShowsMetadataParam,
	GetUsersHistoryShowsResponse200,
	GetUsersHistoryTypedItemMetadataParam,
	GetUsersHistoryTypedItemResponse200,
	GetUsersLikesMetadataParam,
	GetUsersLikesResponse200,
	GetUsersListsCollaborationsMetadataParam,
	GetUsersListsCollaborationsResponse200,
	GetUsersListsListCommentsMetadataParam,
	GetUsersListsListCommentsResponse200,
	GetUsersListsListItemsAllMetadataParam,
	GetUsersListsListItemsAllResponse200,
	GetUsersListsListItemsMediaMetadataParam,
	GetUsersListsListItemsMediaResponse200,
	GetUsersListsListItemsMovieMetadataParam,
	GetUsersListsListItemsMovieResponse200,
	GetUsersListsListItemsShowMetadataParam,
	GetUsersListsListItemsShowResponse200,
	GetUsersListsListItemsTypedSortedMetadataParam,
	GetUsersListsListItemsTypedSortedResponse200,
	GetUsersListsListLikesMetadataParam,
	GetUsersListsListLikesResponse200,
	GetUsersListsListSummaryMetadataParam,
	GetUsersListsListSummaryResponse200,
	GetUsersListsPersonalMetadataParam,
	GetUsersListsPersonalResponse200,
	GetUsersMonthInReviewMetadataParam,
	GetUsersMonthInReviewResponse200,
	GetUsersNotesMetadataParam,
	GetUsersNotesResponse200,
	GetUsersPlexServerAccountsMetadataParam,
	GetUsersPlexServerAccountsResponse200,
	GetUsersPlexServerAccountsResponse401,
	GetUsersPlexServerAccountsResponse404,
	GetUsersPlexServerAccountsResponse422,
	GetUsersPlexServerAccountsResponse502,
	GetUsersPlexServerAccountsResponse503,
	GetUsersPlexServerAccountsResponse504,
	GetUsersPlexServersResponse200,
	GetUsersPlexServersResponse401,
	GetUsersPlexServersResponse502,
	GetUsersPlexServersResponse504,
	GetUsersPlexSettingsResponse200,
	GetUsersProfileMetadataParam,
	GetUsersProfileResponse200,
	GetUsersRatingsAllMetadataParam,
	GetUsersRatingsAllResponse200,
	GetUsersRatingsEpisodesMetadataParam,
	GetUsersRatingsEpisodesResponse200,
	GetUsersRatingsMoviesMetadataParam,
	GetUsersRatingsMoviesResponse200,
	GetUsersRatingsShowsMetadataParam,
	GetUsersRatingsShowsResponse200,
	GetUsersRatingsTypedRatingMetadataParam,
	GetUsersRatingsTypedRatingResponse200,
	GetUsersReactionsCommentsMetadataParam,
	GetUsersReactionsCommentsResponse200,
	GetUsersRequestsFollowMetadataParam,
	GetUsersRequestsFollowResponse200,
	GetUsersRequestsFollowingMetadataParam,
	GetUsersRequestsFollowingResponse200,
	GetUsersSettingsMetadataParam,
	GetUsersSettingsResponse200,
	GetUsersStatsMetadataParam,
	GetUsersStatsResponse200,
	GetUsersSyncsDetailsMetadataParam,
	GetUsersSyncsDetailsResponse200,
	GetUsersSyncsDetailsResponse404,
	GetUsersSyncsListByTypeMetadataParam,
	GetUsersSyncsListByTypeResponse200,
	GetUsersSyncsListByTypeResponse404,
	GetUsersSyncsListMetadataParam,
	GetUsersSyncsListResponse200,
	GetUsersSyncsPausedMetadataParam,
	GetUsersSyncsPausedResponse200,
	GetUsersSyncsPausedResponse404,
	GetUsersSyncsSkippedMetadataParam,
	GetUsersSyncsSkippedResponse200,
	GetUsersSyncsSkippedResponse404,
	GetUsersWatchedMinimalMoviesMetadataParam,
	GetUsersWatchedMinimalMoviesResponse200,
	GetUsersWatchedMinimalShowsMetadataParam,
	GetUsersWatchedMinimalShowsResponse200,
	GetUsersWatchedTypedMetadataParam,
	GetUsersWatchedTypedResponse200,
	GetUsersWatchingMetadataParam,
	GetUsersWatchingResponse200,
	GetUsersWatchingResponse204,
	GetUsersWatchlistAllMetadataParam,
	GetUsersWatchlistAllResponse200,
	GetUsersWatchlistCommentsMetadataParam,
	GetUsersWatchlistCommentsResponse200,
	GetUsersWatchlistMoviesMetadataParam,
	GetUsersWatchlistMoviesResponse200,
	GetUsersWatchlistShowsMetadataParam,
	GetUsersWatchlistShowsResponse200,
	GetUsersWatchlistTypedSortedMetadataParam,
	GetUsersWatchlistTypedSortedResponse200,
	GetUsersYearInReviewMetadataParam,
	GetUsersYearInReviewResponse200,
	GetWatchnowSourcesAllResponse200,
	GetWatchnowSourcesCountryMetadataParam,
	GetWatchnowSourcesCountryResponse200,
	GetYounifyConnectionsResponse200,
	PostCheckinStartBodyParam,
	PostCheckinStartResponse200,
	PostCheckinStartResponse409,
	PostCommentsLikeMetadataParam,
	PostCommentsLikeResponse204,
	PostCommentsPostBodyParam,
	PostCommentsPostResponse201,
	PostCommentsReactionsAddMetadataParam,
	PostCommentsReactionsAddResponse201,
	PostCommentsReplyBodyParam,
	PostCommentsReplyMetadataParam,
	PostCommentsReplyResponse201,
	PostCommentsReportBodyParam,
	PostCommentsReportMetadataParam,
	PostCommentsReportResponse201,
	PostCommentsReportResponse400,
	PostCommentsReportResponse409,
	PostEpisodesReportBodyParam,
	PostEpisodesReportMetadataParam,
	PostEpisodesReportResponse201,
	PostEpisodesReportResponse400,
	PostEpisodesReportResponse409,
	PostListsLikeMetadataParam,
	PostListsLikeResponse204,
	PostListsReportBodyParam,
	PostListsReportMetadataParam,
	PostListsReportResponse201,
	PostListsReportResponse400,
	PostListsReportResponse409,
	PostMoviesJustwatchRefreshMetadataParam,
	PostMoviesJustwatchRefreshResponse201,
	PostMoviesRefreshMetadataParam,
	PostMoviesRefreshResponse201,
	PostMoviesReportBodyParam,
	PostMoviesReportMetadataParam,
	PostMoviesReportResponse201,
	PostMoviesReportResponse400,
	PostMoviesReportResponse409,
	PostNotesCreateBodyParam,
	PostNotesCreateResponse201,
	PostOauthDeviceCodeBodyParam,
	PostOauthDeviceCodeResponse200,
	PostOauthDeviceTokenBodyParam,
	PostOauthDeviceTokenResponse200,
	PostOauthDeviceTokenResponse400,
	PostOauthRevokeBodyParam,
	PostOauthRevokeResponse200,
	PostOauthTokenBodyParam,
	PostOauthTokenResponse200,
	PostOauthTokenResponse400,
	PostPeopleRefreshMetadataParam,
	PostPeopleRefreshResponse201,
	PostPeopleReportBodyParam,
	PostPeopleReportMetadataParam,
	PostPeopleReportResponse201,
	PostPeopleReportResponse400,
	PostPeopleReportResponse409,
	PostScrobblePauseBodyParam,
	PostScrobblePauseResponse201,
	PostScrobbleStartBodyParam,
	PostScrobbleStartResponse201,
	PostScrobbleStopBodyParam,
	PostScrobbleStopResponse201,
	PostSearchRecentAddBodyParam,
	PostSearchRecentAddResponse201,
	PostSearchRecentRemoveBodyParam,
	PostSearchRecentRemoveResponse204,
	PostSeasonsReportBodyParam,
	PostSeasonsReportMetadataParam,
	PostSeasonsReportResponse201,
	PostSeasonsReportResponse400,
	PostSeasonsReportResponse409,
	PostShowsEpisodeReportBodyParam,
	PostShowsEpisodeReportMetadataParam,
	PostShowsEpisodeReportResponse201,
	PostShowsEpisodeReportResponse400,
	PostShowsEpisodeReportResponse409,
	PostShowsJustwatchRefreshMetadataParam,
	PostShowsJustwatchRefreshResponse201,
	PostShowsProgressResetMetadataParam,
	PostShowsProgressResetResponse200,
	PostShowsRefreshMetadataParam,
	PostShowsRefreshResponse201,
	PostShowsReportBodyParam,
	PostShowsReportMetadataParam,
	PostShowsReportResponse201,
	PostShowsReportResponse400,
	PostShowsReportResponse409,
	PostShowsSeasonReportBodyParam,
	PostShowsSeasonReportMetadataParam,
	PostShowsSeasonReportResponse201,
	PostShowsSeasonReportResponse400,
	PostShowsSeasonReportResponse409,
	PostSyncCollectionAddBodyParam,
	PostSyncCollectionAddResponse201,
	PostSyncCollectionRemoveBodyParam,
	PostSyncCollectionRemoveResponse200,
	PostSyncFavoritesAddBodyParam,
	PostSyncFavoritesAddResponse201,
	PostSyncFavoritesRemoveBodyParam,
	PostSyncFavoritesRemoveResponse200,
	PostSyncFavoritesReorderBodyParam,
	PostSyncFavoritesReorderResponse200,
	PostSyncHistoryAddBodyParam,
	PostSyncHistoryAddResponse200,
	PostSyncHistoryRemoveBodyParam,
	PostSyncHistoryRemoveResponse200,
	PostSyncRatingsAddBodyParam,
	PostSyncRatingsAddResponse201,
	PostSyncRatingsRemoveBodyParam,
	PostSyncRatingsRemoveResponse200,
	PostSyncWatchlistAddBodyParam,
	PostSyncWatchlistAddResponse201,
	PostSyncWatchlistRemoveBodyParam,
	PostSyncWatchlistRemoveResponse200,
	PostSyncWatchlistReorderBodyParam,
	PostSyncWatchlistReorderResponse200,
	PostUsersBlockMetadataParam,
	PostUsersBlockResponse201,
	PostUsersBlockResponse409,
	PostUsersFiltersAddBodyParam,
	PostUsersFiltersAddResponse201,
	PostUsersFollowMetadataParam,
	PostUsersFollowResponse201,
	PostUsersFollowResponse409,
	PostUsersHiddenAddBodyParam,
	PostUsersHiddenAddMetadataParam,
	PostUsersHiddenAddResponse200,
	PostUsersHiddenRemoveCalendarBodyParam,
	PostUsersHiddenRemoveCalendarResponse200,
	PostUsersHiddenRemoveProgressBodyParam,
	PostUsersHiddenRemoveProgressResponse200,
	PostUsersHiddenRemoveSectionBodyParam,
	PostUsersHiddenRemoveSectionMetadataParam,
	PostUsersHiddenRemoveSectionResponse200,
	PostUsersListsCreateBodyParam,
	PostUsersListsCreateMetadataParam,
	PostUsersListsCreateResponse201,
	PostUsersListsListAddBodyParam,
	PostUsersListsListAddMetadataParam,
	PostUsersListsListAddResponse201,
	PostUsersListsListAddResponse420,
	PostUsersListsListLikeMetadataParam,
	PostUsersListsListLikeResponse204,
	PostUsersListsListRemoveBodyParam,
	PostUsersListsListRemoveMetadataParam,
	PostUsersListsListRemoveResponse200,
	PostUsersListsListReorderBodyParam,
	PostUsersListsListReorderItemsBodyParam,
	PostUsersListsListReorderItemsMetadataParam,
	PostUsersListsListReorderItemsResponse200,
	PostUsersListsListReorderMetadataParam,
	PostUsersListsListReorderResponse200,
	PostUsersListsListReportBodyParam,
	PostUsersListsListReportMetadataParam,
	PostUsersListsListReportResponse201,
	PostUsersListsListReportResponse400,
	PostUsersListsListReportResponse409,
	PostUsersListsReorderBodyParam,
	PostUsersListsReorderMetadataParam,
	PostUsersListsReorderResponse200,
	PostUsersPlexConnectBodyParam,
	PostUsersPlexConnectResponse200,
	PostUsersPlexConnectResponse400,
	PostUsersPlexSyncBodyParam,
	PostUsersPlexSyncResponse201,
	PostUsersPlexSyncResponse422,
	PostUsersReportBodyParam,
	PostUsersReportMetadataParam,
	PostUsersReportResponse201,
	PostUsersReportResponse400,
	PostUsersReportResponse409,
	PostUsersRequestsApproveMetadataParam,
	PostUsersRequestsApproveResponse200,
	PostUsersRequestsApproveResponse404,
	PostYounifyConnectBodyParam,
	PostYounifyConnectResponse200,
	PostYounifyConnectResponse400,
	PostYounifyConnectResponse422,
	PostYounifyRefreshAllMetadataParam,
	PostYounifyRefreshAllResponse204,
	PostYounifyRefreshMetadataParam,
	PostYounifyRefreshResponse204,
	PutCommentsEditBodyParam,
	PutCommentsEditMetadataParam,
	PutCommentsEditResponse200,
	PutNotesUpdateBodyParam,
	PutNotesUpdateMetadataParam,
	PutNotesUpdateResponse200,
	PutSyncFavoritesUpdateBodyParam,
	PutSyncFavoritesUpdateItemBodyParam,
	PutSyncFavoritesUpdateItemMetadataParam,
	PutSyncFavoritesUpdateItemResponse204,
	PutSyncFavoritesUpdateResponse200,
	PutSyncWatchlistUpdateBodyParam,
	PutSyncWatchlistUpdateItemBodyParam,
	PutSyncWatchlistUpdateItemMetadataParam,
	PutSyncWatchlistUpdateItemResponse204,
	PutSyncWatchlistUpdateResponse200,
	PutUsersAvatarBodyParam,
	PutUsersAvatarResponse204,
	PutUsersAvatarResponse400,
	PutUsersCoverBodyParam,
	PutUsersCoverResponse204,
	PutUsersCoverResponse400,
	PutUsersListsListUpdateBodyParam,
	PutUsersListsListUpdateItemBodyParam,
	PutUsersListsListUpdateItemMetadataParam,
	PutUsersListsListUpdateItemResponse204,
	PutUsersListsListUpdateMetadataParam,
	PutUsersListsListUpdateResponse200,
	PutUsersPlexUpdateSettingsBodyParam,
	PutUsersPlexUpdateSettingsResponse204,
	PutUsersSaveSettingsBodyParam,
	PutUsersSaveSettingsResponse201
} from './types';
