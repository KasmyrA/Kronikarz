import { User } from "./userInterfaces";

const serverAddress = "http://127.0.0.1:8000";
const refreshTokenKey = "refreshToken";
const accessTokenKey = "accessToken";

async function authFetch(url: string, method: string, body?: object, headers = new Headers()) {
  const bodyString = body ? JSON.stringify(body) : undefined;
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
  const refreshToken = localStorage.getItem(refreshTokenKey);
  if (!refreshToken) {
    return null;
  }

  const { user_id } = JSON.parse(atob(refreshToken.split('.')[1]));
  return await getUser(user_id);
}

export async function getUser(id: string) {
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