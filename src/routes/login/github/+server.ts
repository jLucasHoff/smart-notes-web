import { generateState } from "arctic";
import { GITHUB } from "$lib/server/github_oauth";

import type { RequestEvent } from "@sveltejs/kit";

export const GET = async (event: RequestEvent): Promise<Response> => {
	const state = generateState();
	const url = GITHUB.createAuthorizationURL(state, []);

	event.cookies.set("github_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}