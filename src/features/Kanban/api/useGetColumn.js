import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useGetColumn = create((set) => ({
  columns: [],
  error: null,
  loading: false,

  getColumnFunc: async (boardId) => {
    try {
      set({ loading: true });
      const respColumn = await axiosInstance.get(
        `kanban/boards/${boardId}/columns`
      );
      set({ loading: false, columns: respColumn.data || [] });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
