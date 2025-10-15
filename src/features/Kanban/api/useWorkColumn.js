// "@/features/Kanban/api/useWorkColumn.js"
import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useWorkColumn = create((set, get) => ({
  columns: [],
  error: null,
  loading: false,

  // POST
  errorPost: null,
  loadingPost: false,

  // DELETE
  errorDelete: null,
  loadingDelete: false,

  async getColumnFunc(boardId) {
    try {
      set({ loading: true, error: null });
      const resp = await axiosInstance.get(`kanban/boards/${boardId}/columns`);
      set({ loading: false, columns: resp.data || [] });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async postColumnFunc(boardId, payload) {
    try {
      set({ loadingPost: true, errorPost: null });
      const resp = await axiosInstance.post(
        `kanban/boards/${boardId}/columns`,
        payload
      );
      const created = resp?.data;

      // оптимистично добавим в локальный стейт
      set((s) => ({
        columns: Array.isArray(s.columns)
          ? [...s.columns, created].sort(
              (a, b) => (a.position ?? 0) - (b.position ?? 0)
            )
          : [created],
      }));

      return created;
    } catch (error) {
      set({ errorPost: error.message });
      throw error;
    } finally {
      set({ loadingPost: false });
    }
  },

  async deleteColumnFunc(boardId, columnId) {
    try {
      set({ loadingDelete: true, errorDelete: null });
      await axiosInstance.delete(
        `kanban/boards/${boardId}/columns/${columnId}`
      );

      set((s) => ({
        columns: (s.columns || []).filter((c) => String(c.id) !== String(columnId)),
      }));
    } catch (error) {
      set({ errorDelete: error.message });
      throw error;
    } finally {
      set({ loadingDelete: false });
    }
  },

  async createAndReload(boardId, payload) {
    const created = await get().postColumnFunc(boardId, payload);
    await get().getColumnFunc(boardId);
    return created;
  },
}));
