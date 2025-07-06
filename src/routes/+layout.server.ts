import { verifyToken } from '$lib/server/jwt';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('auth_token');

	const response: { user: string | null, serverMessage?: string } = {
		user: null
	}

	//não logado
	if (!token) {
        return { user: null };
    }

	const user = verifyToken(token);

	//cookies expirados
	if (!user) {
		cookies.delete('auth_token', { path: '/' });
		response.serverMessage = "Sessão expirada, conecte-se novamente"
		return response;
	}
    
	response.user = user.username;
	response.serverMessage = `Seja bem-vindo, ${user.username}`;
	
	return response;
};