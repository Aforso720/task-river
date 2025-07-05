import { create } from 'zustand';

const useModalAddElemStore = create((set) => ({
  ModalAddElemState: false,
  typeModalAddElem: null, 

  openModalAddElem: (typeModalAddElem) => set({ ModalAddElemState: true, typeModalAddElem }),
  closeModalAddElem: () => set({ ModalAddElemState: false, typeModalAddElem: null }),
}));

export default useModalAddElemStore;
