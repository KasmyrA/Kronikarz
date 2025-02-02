import { User } from "./userInterfaces";

export const serverAddress = "http://127.0.0.1:8000";
const refreshTokenKey = "refreshToken";
const accessTokenKey = "accessToken";

export async function authFetch(url: string, method: string, body?: any, headers = new Headers(), stringifyBody = true) {
  const bodyString = body && stringifyBody ? JSON.stringify(body) : body;
  const accessToken = localStorage.getItem(accessTokenKey)
  headers.append("Authorization", `Bearer ${accessToken}`);
  if (accessToken) {
    const resp = await fetch(url, { body: bodyString, headers: headers, method });
    if (resp.status !== 401) {
      return resp;
    }
  }

  const newAccessToken = await getAccessToken();
  if (!newAccessToken) {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    return null;
  }

  localStorage.setItem(accessTokenKey, newAccessToken);
  headers.set("Authorization", `Bearer ${newAccessToken}`);
  return await fetch(url, { body: bodyString, headers, method });
}

async function getAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) {
    return null;
  }

  try {
    const headers = new Headers()
    headers.append("Content-Type", "application/json");
    const body = { refresh: refreshToken }
    const resp = await fetch(`${serverAddress}/users/token/refresh`, { method: "POST", body: JSON.stringify(body), headers })
    const json = await resp.json();
    return json.access
  } catch {
    return null
  }
}

export async function register(email: string, username: string, password: string) {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const body = { email, username, password };
  await fetch(`${serverAddress}/users/`, { method: "POST", body: JSON.stringify(body), headers });
  return await login(username, password);
}

export async function login(username: string, password: string) {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const body = { username, password }
  const resp = await fetch(`${serverAddress}/users/token/`, { method: "POST", body: JSON.stringify(body), headers });

  if (!resp.ok) {
    return await resp.json();
  }

  const { refresh, access } = await resp.json();
  localStorage.setItem(refreshTokenKey, refresh);
  localStorage.setItem(accessTokenKey, access);
  return await getCurrentUser();
}

export async function getCurrentUser() {
  const userId = getCurrentUserId();

  if (userId === null || userId === undefined) {
    return null;
  }

  return await getUser(userId);
}

export function getCurrentUserId(): number | null | undefined {
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) {
    return null;
  }

  const tokenData = JSON.parse(atob(refreshToken.split('.')[1]));
  return tokenData.user_id;
}

export async function getUser(id: number) {
  const resp = await authFetch(`${serverAddress}/users/${id}/`, "GET")
  const user: User | null = await resp?.json();
  return user;
}

export async function logout() {
  const headers = new Headers()
  headers.append("Content-Type", "application/json");
  const body = { refresh: localStorage.getItem(refreshTokenKey) };
  await authFetch(`${serverAddress}/users/logout/`, "POST", body, headers);
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
}