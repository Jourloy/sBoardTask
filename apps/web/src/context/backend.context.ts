
import axios from "axios";
import Cookie from "js-cookie";

export const backendUrl = `http://localhost:10000`;

export function createBackendContext() {
	return axios.create({
		baseURL: backendUrl,
		headers: {
			Authorization: `Bearer ${Cookie.get(`access`)}`,
			"Access-Control-Allow-Origin": backendUrl,
			"refresh": localStorage.getItem(`refresh`),
		},
	});
}

export async function updateTokens() {
	const refresh = localStorage.getItem(`refresh`);
	if (!refresh) return false;

	const ctx = createBackendContext();
	const response = await ctx.get(`/auth/tokens`, {headers: {Refresh: refresh}}).catch(() => null);
	if (!response || response.status !== 200) return false;

	Cookie.set(`access`, response.data.access);
	localStorage.setItem(`refresh`, response.data.refresh);
	return true;
}

export async function checkAdmin() {
	const backendContext = createBackendContext();
	return await backendContext
		.get(`/admin`)
		.then(() => true)
		.catch(() => false);
}