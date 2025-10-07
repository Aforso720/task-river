import { create } from "zustand";

const useAuthModalStore = create((set)=>({
    modalAuthLogin:false,
    modalAuthRegistr:false,

    openModalAuthState:()=>set({modalAuthLogin:true,modalAuthRegistr:false}),
    closeModalAuthState:()=>set({modalAuthLogin:false}),
    openModalAuthRegistr:()=>set({modalAuthRegistr:true,modalAuthLogin:false}),
    closeModalAuthRegistr:()=>set({modalAuthRegistr:false}),
}));

export default useAuthModalStore;