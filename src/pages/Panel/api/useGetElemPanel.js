import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";

export const useGetElemPanel = create((set) => ({
  projects: [],
  boards: [],
  tasks: [],
  error: null,
  loading: false,

  getAllElemPanel: async () => {
    set({ loading: true });
    try {
      const [resProjects, resBoards, resTasks] = await Promise.all([
        axiosInstance.get("/kanban/projects"),
        axiosInstance.get("/kanban/boards"),
        axiosInstance.get("/kanban/projects"),
      ]);
      set({
        projects: resProjects.data || [],
        boards: resBoards.data || [],
        tasks: resTasks.data || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
