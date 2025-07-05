import { GITHUB } from "$lib/server/github_oauth";
import { CREATE_AND_SET_COOKIE } from "$lib/server/jwt";

import type { RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent): Promise<Response> => {
	const CODE = event.url.searchParams.get("code");
	const STATE = event.url.searchParams.get("state");
	const STORED_STATE = event.cookies.get("github_oauth_state");

	if (!CODE || !STATE || !STORED_STATE || STATE !== STORED_STATE) {
		return new Response(null, { status: 400, statusText: 'Invalid request' });
	}

	try {
		const TOKENS = await GITHUB.validateAuthorizationCode(CODE);
		const GITHUB_USER_RESPONSE = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${TOKENS.accessToken}`
			}
		});
		const GITHUB_USER = await GITHUB_USER_RESPONSE.json();

		// Cria o JWT e o define no cookie
		CREATE_AND_SET_COOKIE(event.cookies, {
			id: GITHUB_USER.id,
			githubUsername: GITHUB_USER.username
		});

		// Redireciona para a página principal
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});

	} catch (e) {
		console.error(e);
		return new Response(null, { status: 500, statusText: 'Internal Server Error' });
	}
}