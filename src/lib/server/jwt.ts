import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { Cookies } from '@sveltejs/kit';

interface IUserPayload {
	id: string,
	githubUsername: string
}

const JWT_COOKIE_NAME = 'jwt_token';
const JWT_EXPIRES_IN = '90d';

export const CREATE_AND_SET_COOKIE = (cookies: Cookies, user: IUserPayload) => {
	const TOKEN = jwt.sign(user, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

	cookies.set(JWT_COOKIE_NAME, TOKEN, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 90,
	});
}

export const VERIFY_AND_GET_USER = (cookies: Cookies): IUserPayload | null => {
	const TOKEN = cookies.get(JWT_COOKIE_NAME);
	if (!TOKEN) return null;

	try {
		const DECODED = jwt.verify(TOKEN, JWT_SECRET);
		return DECODED as IUserPayload;
	} 
    catch (err) { return null; }
}

export const CLEAR_COOKIE = (cookies: Cookies) => {
	cookies.delete(JWT_COOKIE_NAME, {
		path: '/',
	});
}