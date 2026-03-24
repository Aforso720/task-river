import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const usePostElemPanel = create((set) => ({
  error: null,

  async createElemPanel(payload, type) {
    set({ error: null });
    try {
      const res = await axiosInstance.post(`/kanban/${type}`, payload);
      return res.data;
    } catch (error) {
      set({ error });
      // ВАЖНО: пробрасываем ошибку наверх, чтобы компонент НЕ закрывал модалку
      throw error;
    }
  },

  async editBoard(boardId, payload) {
    try {
      await axiosInstance.put(`/kanban/boards/${boardId}`, payload);
    } catch (error) {
      set({ error });
      throw error;
    }
  },
}));
