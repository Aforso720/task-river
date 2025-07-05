import { create } from "zustand";

export const ModalTaskState = create((set) => ({
  modalInTaskState: false,
  mode: "add",
  taskData: null, 

  openModalTaskState: (mode = "add", taskData = null) =>
    set({ modalInTaskState: true, mode, taskData }),

  closeModalTaskState: () =>
    set({ modalInTaskState: false, mode: "add", taskData: null }),
}));
