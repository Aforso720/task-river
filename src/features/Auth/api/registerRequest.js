// stores/useRegisterRequest.js (JS)
import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";
import useAuthStore from "./loginRequest";

const useRegisterRequest = create((set) => ({
  loading: false,
  error: null,
  success: false,

  registerRequest: async (payload, { navigate } = {}) => {
    try {
      set({ loading: true, error: null, success: false });
      const res = await axiosInstance.post("/auth/signup", payload);
      const data = res?.data || {};

      if (data.token || data.accessToken || data.user) {
        const setAuthFromResponse = useAuthStore.getState().setAuthFromResponse;
        setAuthFromResponse(data);
        set({ loading: false, success: true });
        if (navigate) navigate("/panel");
        return;
      }

      set({ loading: false, success: true });


    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Не удалось зарегистрироваться. Проверьте данные.";
      set({ loading: false, error: msg, success: false });
    }
  },

  reset: () => set({ loading: false, error: null, success: false }),
}));

export default useRegisterRequest;
