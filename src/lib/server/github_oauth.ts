import { GitHub } from "arctic";
import { GITHUB_OAUTH_ID, GITHUB_OAUTH_SECRET } from "$env/static/private";

export const GITHUB = new GitHub(GITHUB_OAUTH_ID, GITHUB_OAUTH_SECRET, "https://smart-notes-web.vercel.app/login/github/callback");