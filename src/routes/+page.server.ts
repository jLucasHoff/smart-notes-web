import { verifyToken } from '$lib/server/jwt';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');

	if (!token) {
        return { user: null };
    }

	const user = verifyToken(token);

	if (!user) {
		cookies.delete('auth_token', { path: '/' });
		return { user: null };
	}

	return { user };
};