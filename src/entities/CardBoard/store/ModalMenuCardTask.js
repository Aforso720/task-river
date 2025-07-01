import { create } from "zustand";

export const ModalMenuCardTask = create((set) => ({
  modalMenuCardTaskState: false,
  menuCardPosition: { top: 0, left: 0 },
  currentTaskId: null,
  openModalMenuCardTaskState: (position, columnId) => set({ 
    modalMenuCardTaskState: true,
    menuCardPosition: position,
    currentTaskId: columnId
  }),
  closeModalMenuCardTaskState: () => set({ modalMenuCardTaskState: false }),
}));
