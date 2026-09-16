import { getAccessToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function apiFetch(path: string, init?: RequestInit) {
  const token = getAccessToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${API_URL}${path}`, { ...init, headers });
}
