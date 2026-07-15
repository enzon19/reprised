<script lang="ts">
	import { PUBLIC_TRAKT_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public';
	import { DateTime } from 'luxon';

	let { data } = $props();
	let { user, stats } = $derived(data);
</script>

{#if user}
	<div class="flex gap-2 items-center">
		<img src={user.images?.avatar.full} alt="User Avatar" class="size-24" />
		<div>
			<h1>Hello, {user.name} {user.vip}</h1>
			<p>Member since {DateTime.fromISO(user.joined_at!).toLocaleString(DateTime.DATETIME_MED)}</p>
			<!-- on click changes to relative -->
		</div>
	</div>
	{#if stats}
		<div class="flex flex-row justify-around">
			<a href="/users/{user.username}/history/episodes">
				<span>
					{stats.episodes.minutes} watched
				</span>
				<span>
					{stats.episodes.watched} eps ({stats.episodes.plays} plays)
				</span>
			</a>
			<a href="/users/{user.username}/history/movies">
				<span>
					{stats.movies.minutes} watched
				</span>
				<span>
					{stats.movies.watched} movies ({stats.movies.plays} plays)
				</span>
			</a>
			<span>
				<a href="/users/{user.username}/library/episodes">
					{stats.episodes.collected} episodes in library
				</a>
				<a href="/users/{user.username}/library/movies">
					{stats.movies.collected} movies in library
				</a>
			</span>
		</div>
	{/if}
	<img src={user.vip_cover_image} class="h-10" alt="User Cover" referrerpolicy="no-referrer" />
{:else}
	<a
		class="bg-red-400 py-2 px-4 cursor-pointer m-4 inline-block rounded-lg"
		href="https://trakt.tv/oauth/authorize?response_type=code&client_id={PUBLIC_TRAKT_CLIENT_ID}&redirect_uri={PUBLIC_BASE_URL}/authorized"
		>Login with Trakt</a>
{/if}
