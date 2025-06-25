import { create } from "zustand";

const useOpenColumnMenu = create((set) => ({
  isModalColumnMenu: false,
  menuPosition: { top: 0, left: 0 },
  currentColumnId: null,
  editModalColumnMenu: (position, columnId) => set({ 
    isModalColumnMenu: true,
    menuPosition: position,
    currentColumnId: columnId
  }),
  closeModalColumnMenu: () => set({ isModalColumnMenu: false })
}))

export default useOpenColumnMenu;