import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const usePutPassword = create((set) => ({
  loading: false,
  success: false,
  error: null,

  putPassword: async (newData) => {
    try {
      set({ loading: true, success: false, error: null });

      // важно: await
      await axiosInstance.put("/user/password", newData);

      // если сервер не возвращает тело — это ок, просто ставим success
      set({ loading: false, success: true, error: null });
      return true;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Не удалось обновить пароль";

      set({ loading: false, success: false, error: message });
      return false;
    }
  },

  resetStatus: () => set({ success: false, error: null }),
}));
