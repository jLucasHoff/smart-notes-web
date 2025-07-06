import { redirect } from "@sveltejs/kit";
import { GITHUB_OAUTH_ID } from "$env/static/private";

export const GET = async () => {
    const GITHUB_AUTH_URL = new URL("https://github.com/login/oauth/authorize");

    GITHUB_AUTH_URL.searchParams.append("client_id", GITHUB_OAUTH_ID);
    GITHUB_AUTH_URL.searchParams.append("scope", "read:user read:org");

    throw redirect(302, GITHUB_AUTH_URL.toString())
}