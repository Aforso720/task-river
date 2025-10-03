import { create } from "zustand";

const useAuthModalStore = create((set)=>({
    modalAuthLogin:false,
    modalAuthRegistr:false,

    openModalAuthState:()=>set({modalAuthLogin:true}),
    closeModalAuthState:()=>set({modalAuthLogin:false,modalAuthRegistr:false}),
    openModalAuthRegistr:()=>set({modalAuthRegistr:true}),
    closeModalAuthRegistr:()=>set({modalAuthLogin:true,modalAuthRegistr:false}),
}));

export default useAuthModalStore;