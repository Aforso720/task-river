import { create } from "zustand";

export const useAdminLocation = create((set)=>({
    listNavActiveHead:1,
    setListNavActiveHead: (listElem) => set({listNavActiveHead:listElem})
}))

