import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useWorkTasks = create((set, get) => ({
  tasks: [],
  error: null,
  loading: false,

  loadingPost: false,
  errorPost: null,

  loadingPut: false,
  errorPut: null,

  async getTasksFunc(boardId) {
    try {
      set({ loading: true, error: null });
      const resp = await axiosInstance.get(`kanban/boards/${boardId}/task-cards`);
      set({ loading: false, tasks: resp.data || [] });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async postTasksFunc(boardId, payload) {
    try {
      set({ loadingPost: true, errorPost: null });

      const resp = await axiosInstance.post(
        `kanban/boards/${boardId}/task-cards`,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          transformRequest: [(d) => d], // не трогаем сериализованный JSON
        }
      );

      const created = resp?.data;
      set((s) => ({ tasks: [...(s.tasks || []), created] }));
      return created;
    } catch (error) {
      set({ errorPost: error.message });
      throw error;
    } finally {
      set({ loadingPost: false });
    }
  },

  async updateTasksFunc(boardId, taskId, payload) {
    try {
      set({ loadingPut: true, errorPut: null });

      const resp = await axiosInstance.put(
        `kanban/boards/${boardId}/task-cards/${taskId}`,
        JSON.stringify(payload),
        {
          headers: { "Content-Type": "application/json;charset=UTF-8" },
          transformRequest: [(d) => d],
        }
      );

      const updated = resp?.data;
      // оптимистично подменим в сторе
      set((s) => ({
        tasks: (s.tasks || []).map((t) => (t.id === taskId ? updated : t)),
      }));

      return updated;
    } catch (error) {
      set({ errorPut: error.message });
      throw error;
    } finally {
      set({ loadingPut: false });
    }
  },
}));
