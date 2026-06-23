import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string, refreshToken: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setTenantId: (tenantId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  tenantId: localStorage.getItem("tenantId"),
  isAuthenticated: !!localStorage.getItem("token"),

  login: (user, token, refreshToken) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    set({ user, token, refreshToken, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tenantId");
    set({ user: null, token: null, refreshToken: null, tenantId: null, isAuthenticated: false });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  setTenantId: (tenantId) => {
    localStorage.setItem("tenantId", tenantId);
    set({ tenantId });
  },
}));
