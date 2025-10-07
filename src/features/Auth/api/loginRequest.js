import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";
import { tokenStorage } from "@shared/lib/tokenStorage";
import { getExpMs } from "@shared/lib/jwt"; 

let expTimer = null;
const planAutoLogout = (logout, token) => {
  clearTimeout(expTimer);
  const expMs = getExpMs ? getExpMs(token) : 0;
  if (!expMs) return;
  const delta = expMs - Date.now() - 60_000; 
  if (delta > 0) expTimer = setTimeout(logout, delta);
};

const useAuthStore = create((set, get) => ({
  sessionToken: tokenStorage.get(),
  userId: null,
  username: null,
  email: null,
  roles: null,
  loading: false,
  error: null,

  isAuthenticated: () => !!get().sessionToken,

  setAuthFromResponse: (data) => {
    const token = data.token ?? data.accessToken ?? null;
    const user = data.user || data || {};
    if (token) {
      tokenStorage.set(token);
      planAutoLogout(get().logout, token);
    }
    set({
      sessionToken: token,
      userId: user.id ?? null,
      username: user.username ?? null,
      email: user.email ?? null,
      roles: user.roles ?? null,
      loading: false,
      error: null,
    });
  },

  loginRequest: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/auth/signin", payload);
      get().setAuthFromResponse(res?.data || {});
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Не удалось войти. Проверьте данные.";
      set({ error: msg, loading: false });
    }
  },

  logout: () => {
    clearTimeout(expTimer);
    tokenStorage.clear();
    set({
      sessionToken: null,
      userId: null,
      username: null,
      email: null,
      roles: null,
      loading: false,
      error: null,
      finishedAuth:true,
    });
  },
}));

export default useAuthStore;
