import { create } from "zustand";

export const ModalTaskState = create((set)=>({
    modalInTaskState:false,
    openModalTaskState : () => set({modalInTaskState:true}),
    closeModalTaskState : () => set({modalInTaskState:false})    
}))