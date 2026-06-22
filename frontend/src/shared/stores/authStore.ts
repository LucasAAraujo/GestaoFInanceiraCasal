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
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string, refreshToken: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
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
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
}));
