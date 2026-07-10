<script>
	import { PUBLIC_TRAKT_CLIENT_ID, PUBLIC_BASE_URL } from '$env/static/public';
	let { data } = $props();
</script>

{#if data.user}
	{data.user.name}
{:else}
	<a
		class="bg-red-400 py-2 px-4 cursor-pointer m-4 inline-block rounded-lg"
		href="https://trakt.tv/oauth/authorize?response_type=code&client_id={PUBLIC_TRAKT_CLIENT_ID}&redirect_uri={PUBLIC_BASE_URL}/authorized"
		>Login with Trakt</a>
{/if}
