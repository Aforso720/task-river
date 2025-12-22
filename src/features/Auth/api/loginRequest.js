// "@/features/Auth/api/loginRequest.js"
import { create } from "zustand";
import { persist } from "zustand/middleware";
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

const useAuthStore = create(
  persist(
    (set, get) => ({
      sessionToken: tokenStorage.get(),
      userId: null,
      username: null,
      email: null,
      roles: null,

      loading: false,
      error: null,

      finishedAuth: false,

      statusRes: false,

      isAuthenticated: () => !!get().sessionToken,
      hasRole: (role) => {
        const rs = get().roles;
        if (!Array.isArray(rs)) return false;
        return rs.some((r) => {
          if (typeof r === "string") return r === role;
          if (r && typeof r === "object") {
            return r.name === role || r.authority === role;
          }
          return false;
        });
      },

      setAuthFromResponse: (data) => {
        const token = data.token ?? data.accessToken ?? null;
        const user = data || {};
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
          finishedAuth: true,
        });
      },

      loginRequest: async (payload) => {
        try {
          set({ loading: true, error: null });
          const res = await axiosInstance.post("/auth/signin", payload);
          get().setAuthFromResponse(res?.data || {});
          return { success: true, data: res.data }; 
        } catch (e) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "Не удалось войти. Проверьте данные.";
          set({ error: msg, loading: false });
          return { success: false, error: msg }; 
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
          finishedAuth: true, // стор «готов», просто без сессии
        });
      },
    }),
    {
      name: "auth-store",
      partialize: (s) => ({
        sessionToken: s.sessionToken,
        userId: s.userId,
        roles: s.roles,
        finishedAuth: s.finishedAuth,
      }),
      // Вот здесь мы говорим: когда persist закончит гидрацию — проставь флаг
      onRehydrateStorage: () => (state, error) => {
        // можно залогировать ошибку
        // if (error) console.error("rehydrate auth-store error", error);
        // после восстановления из storage стор «готов»
        state?.setState?.({ finishedAuth: true });
      },
    }
  )
);

export default useAuthStore;
