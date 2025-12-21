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
    
    // Формируем финальный payload для бэкенда
    const finalPayload = {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      roles: payload.roles || ["user"], // По умолчанию обычный пользователь
      firstName: payload.firstName,
      lastName: payload.lastName,
      ...(payload.middleName && { middleName: payload.middleName }),
      phoneNumber: payload.phoneNumber,
      termsAccepted: payload.termsAccepted
    };

    const res = await axiosInstance.post("/auth/signup", finalPayload);
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
    let errorMessage = "Не удалось зарегистрироваться. Проверьте данные.";
    
    if (e?.response?.data?.message) {
      const serverMsg = e.response.data.message.toLowerCase();
      
      if (serverMsg.includes("email") || serverMsg.includes("почта")) {
        errorMessage = "Пользователь с таким email уже существует.";
      } else if (serverMsg.includes("username") || serverMsg.includes("логин")) {
        errorMessage = "Этот логин уже занят. Выберите другой.";
      } else if (serverMsg.includes("password") || serverMsg.includes("пароль")) {
        errorMessage = "Пароль не соответствует требованиям безопасности.";
      } else if (serverMsg.includes("phone") || serverMsg.includes("телефон")) {
        errorMessage = "Некорректный номер телефона.";
      } else {
        errorMessage = e.response.data.message;
      }
    }
    
    set({ loading: false, error: errorMessage, success: false });
  }
},

  reset: () => set({ loading: false, error: null, success: false }),
}));

export default useRegisterRequest;
