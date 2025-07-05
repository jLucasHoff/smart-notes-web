import { VERIFY_AND_GET_USER } from '$lib/server/jwt';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const USER_PAYLOAD = VERIFY_AND_GET_USER(event.cookies);
	
	if (USER_PAYLOAD) {
		event.locals.user = {
			id: USER_PAYLOAD.id,
			username: USER_PAYLOAD.githubUsername
		};
	} else {
		event.locals.user = null;
	}

	const response = await resolve(event);
	return response;
};