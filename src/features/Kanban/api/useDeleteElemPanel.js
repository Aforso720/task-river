// "@/features/Kanban/api/useDeleteElemPanel.js"
import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";
import { useGetElemPanel } from "@/pages/Panel/api/useGetElemPanel";

const mapRuTypeToPath = (ruType) => {
  if (ruType === "Проекты") return "projects";
  if (ruType === "Доски")   return "boards";
  if (ruType === "Задачи")  return "tasks";
  return ruType; // fallback: вдруг уже пришло на англ.
};

export const useDeleteElemPanel = create((set) => ({
  isDeleting: false,
  error: null,

  async deleteElemPanel(ruType, id) {
    set({ isDeleting: true, error: null });
    try {
      const path = mapRuTypeToPath(ruType);
      await axiosInstance.delete(`/kanban/${path}/${id}`);

      // рефетч общего списка для меню
      const refetch = useGetElemPanel.getState().getAllElemPanel;
      await refetch?.();

      set({ isDeleting: false });
    } catch (e) {
      set({
        isDeleting: false,
        error: e?.response?.data?.message || e.message || "Не удалось удалить",
      });
      throw e;
    }
  },
}));
