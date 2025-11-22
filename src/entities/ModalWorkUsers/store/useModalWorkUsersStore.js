import { create } from "zustand";

const useModalWorkUsersStore = create((set) => ({
  // открыта ли модалка
  isOpen: false,

  // пока делаем только проект,
  // но сюда можно добавить mode: 'project' | 'board' и т.п.
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useModalWorkUsersStore;
