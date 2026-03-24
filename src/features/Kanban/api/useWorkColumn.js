import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useWorkColumn = create((set) => ({
  errorPost: null,
  loadingPost: false,

  errorDelete: null,
  loadingDelete: false,

  async postColumnFunc(boardId, payload) {
    try {
      set({ loadingPost: true, errorPost: null });
      const resp = await axiosInstance.post(
        `kanban/boards/${boardId}/columns`,
        payload
      );
      const created = resp?.data;

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

  async putColumnFunc(boardId, columnId, payload) {
    try {
      set({ loadingPost: true, errorPost: null });

      const apiPayload = {
        name: payload.name,
        position: payload.position ?? payload.postion ?? 0,
      };

      const resp = await axiosInstance.put(
        `kanban/boards/${boardId}/columns/${columnId}`,
        apiPayload
      );

      const updatedColumn = resp.data;

      set((s) => ({
        columns: (s.columns || []).map((c) =>
          String(c.id) === String(columnId) ? { ...c, ...updatedColumn } : c
        ),
      }));

      return updatedColumn;
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
        columns: (s.columns || []).filter(
          (c) => String(c.id) !== String(columnId)
        ),
      }));
    } catch (error) {
      set({ errorDelete: error.message });
      throw error;
    } finally {
      set({ loadingDelete: false });
    }
  },
}));
