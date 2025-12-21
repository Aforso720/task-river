import { create } from "zustand";

export const useFullVerse = create((set)=>({
 isFull : false,
 setFulled : ( bool ) => {
    set({isFull:bool})
 },
}))