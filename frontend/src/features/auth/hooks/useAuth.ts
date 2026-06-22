import { useAuthStore } from "#shared/stores/authStore.ts";

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  return { user, isAuthenticated, login, logout };
}
