import { redirect } from "@sveltejs/kit";
import { GITHUB_OAUTH_ID, GITHUB_OAUTH_SECRET } from "$env/static/private";
import { signToken, type IUserPayload } from "$lib/server/jwt";

export const GET = async ({url, cookies}) => {
    const CODE = url.searchParams.get("code");
    if(!CODE) throw redirect(302, "/?error=no_code");

    try {
        const PARAMS = new URLSearchParams();
        PARAMS.append('client_id', GITHUB_OAUTH_ID);
		PARAMS.append('client_secret', GITHUB_OAUTH_SECRET);
		PARAMS.append('code', CODE);

        const TOKEN_RESPONSE = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
            },
            body: PARAMS
        });

        const TOKEN_DATA = await TOKEN_RESPONSE.json();

        if(TOKEN_DATA.error || !TOKEN_DATA.access_token) {
            console.error("Erro ao obter token: ", TOKEN_DATA);
            throw new Error("Falha na autenticação");
        }

        const ACCESS_TOKEN = TOKEN_DATA.access_token;
        const USER_RESPONSE = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        const GITHUB_USER = await USER_RESPONSE.json();
        const PAYLOAD: IUserPayload = {
            username: GITHUB_USER.login,
            name: GITHUB_USER.name
        }

        const JWT_TOKEN = signToken(PAYLOAD)
        cookies.set("auth_token", JWT_TOKEN, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 14
        });
    } catch (error) {
        console.error('Ocorreu um erro no callback do OAuth:', error);
		throw redirect(302, '/?error=auth_failed');
    }

    throw redirect(302, "/");
}