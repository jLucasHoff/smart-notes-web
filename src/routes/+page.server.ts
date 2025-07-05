import { redirect, fail } from '@sveltejs/kit';
import { CLEAR_COOKIE } from '$lib/server/jwt';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/'); 

	return { user: locals.user };
};

//logout action
export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		if (!locals.user) { return fail(401); }
		
		CLEAR_COOKIE(cookies);

		throw redirect(302, '/');
	}
};