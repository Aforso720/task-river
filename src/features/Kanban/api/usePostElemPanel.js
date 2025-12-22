import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const usePostElemPanel = create((set) => ({
  error: null,
  async createElemPanel(payload, type) {
    try{
    const res = await axiosInstance.post(`/kanban/${type}`, payload);
    return res.data; 
    }catch(error){
      set({ error: error });
    }
  },

  async editBoard(boardId , payload){
    await axiosInstance.put(`/kanban/boards/${boardId}`,payload)
  }
}));
