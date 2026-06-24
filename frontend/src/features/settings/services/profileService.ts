import { api } from "#shared/lib/api.ts";
import type { AuthUser } from "#shared/stores/authStore.ts";

export async function updateProfile(data: { name?: string }) {
  const response = await api.patch<AuthUser>("/users/me", data);
  return response.data;
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const response = await api.post("/users/me/change-password", data);
  return response.data;
}
