import { redirect } from "@sveltejs/kit";
import { GITHUB_OAUTH_ID, GITHUB_OAUTH_SECRET, SMART_NOTES_PAT } from "$env/static/private";
import { signToken, type IUserPayload } from "$lib/server/jwt";

export const GET = async ({url, cookies}) => {
    const CODE = url.searchParams.get("code");
    if(!CODE) throw redirect(302, "/?error=no_code");

    try {
        //jwt token acquire
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
            throw new Error("Falha na autenticação");
        }

        const ACCESS_TOKEN = TOKEN_DATA.access_token;
        const USER_RESPONSE = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        //repo logic
        const GITHUB_USER = await USER_RESPONSE.json();
        
        const PAT = SMART_NOTES_PAT;
        const USERNAME = GITHUB_USER.login
        const REPO = `${USERNAME}-smart-notes`

        const REPO_CHECK_RESPONSE = await fetch(`https://api.github.com/repos/smart-notes-users/${REPO}`, {
            headers: {
                Authorization: `Bearer ${PAT}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        switch (REPO_CHECK_RESPONSE.status) {
            case 404: //repo doesnt exists
                //create repo
                const CREATE_REPO_RESPONSE = await fetch(`https://api.github.com/orgs/smart-notes-users/repos`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${PAT}`,
                        Accept: 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: REPO,
                        private: true, 
                        description: `Repositório de dados do smart-notes para o usuário ${USERNAME}.`
                    })
                });

                //failed creation
                if (!CREATE_REPO_RESPONSE.ok) {
                    const ERROR = await CREATE_REPO_RESPONSE.json();
                
                //repo invite
                } else {		
                    const INVITE_USER_RESPONSE = await fetch(`https://api.github.com/repos/smart-notes-users/${REPO}/collaborators/${USERNAME}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${PAT}`,
                            Accept: 'application/vnd.github.v3+json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            permission: 'push'
                        })
                    });

                    //invite failed
                    if (!INVITE_USER_RESPONSE.ok) {
                        const error = await INVITE_USER_RESPONSE.json();
                        console.error(`[${USERNAME}] Falha ao convidar para o repositório '${REPO}'. Erro:`, error.message);

                    //sucessfull invite
                    } else {
                        console.log(`[${USERNAME}] Convite enviado com sucesso para o repositório '${REPO}'.`);
                    }
                }
                
                break;

            case 200:

                break;
        
            default:
                console.error(`[${USERNAME}] Erro ao verificar o repositório '${REPO}'. Status: ${REPO_CHECK_RESPONSE.status}`);
                break;
        }

        const PAYLOAD: IUserPayload = {
            username: GITHUB_USER.login
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