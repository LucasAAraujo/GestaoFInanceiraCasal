import { api } from "#shared/lib/api.ts";
import type { AuthUser } from "#shared/stores/authStore.ts";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export async function register(data: RegisterPayload) {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function login(data: LoginPayload) {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
}
