import { create } from "zustand";

export const ModalTaskState = create((set, get) => ({
  modalInTaskState: false,
  mode: "add", 
  selectedTask: null,     
  currentColumnId: null,  
  get taskData() {
    return get().selectedTask;
  },

  openModalTaskState: (mode = "add", task = null, columnId = null) =>
    set({
      modalInTaskState: true,
      mode,
      selectedTask: task,
      currentColumnId: columnId ?? get().currentColumnId ?? null,
    }),

  closeModalTaskState: () =>
    set({
      modalInTaskState: false,
      mode: "add",
      selectedTask: null,
      currentColumnId: null,
    }),

  setSelectedTask: (task) => set({ selectedTask: task }),
  setCurrentColumnId: (columnId) => set({ currentColumnId: columnId }),
}));
