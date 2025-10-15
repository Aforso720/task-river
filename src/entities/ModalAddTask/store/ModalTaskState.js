import { create } from "zustand";

export const ModalTaskState = create((set, get) => ({
  // UI
  modalInTaskState: false,
  mode: "add", // "add" | "view" | "edit"

  // данные
  selectedTask: null,     // объект выбранной задачи (карточки)
  currentColumnId: null,  // колонка для add / колонка выбранной карточки

  // ---- совместимость со старым API (taskData):
  get taskData() {
    return get().selectedTask;
  },

  // открыть модалку
  openModalTaskState: (mode = "add", task = null, columnId = null) =>
    set({
      modalInTaskState: true,
      mode,
      selectedTask: task,
      currentColumnId: columnId ?? get().currentColumnId ?? null,
    }),

  // закрыть модалку
  closeModalTaskState: () =>
    set({
      modalInTaskState: false,
      mode: "add",
      selectedTask: null,
      currentColumnId: null,
    }),

  // вспомогательные (по желанию)
  setSelectedTask: (task) => set({ selectedTask: task }),
  setCurrentColumnId: (columnId) => set({ currentColumnId: columnId }),
}));
