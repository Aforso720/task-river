import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";

export const useTariffs = create((set)=>({
    tariffs:[],
    loading:false,
    error:null,
    getTariffs: async () => {
       set({loading:true})
       const res = await axiosInstance.get('')
       set({tariffs:res.data , loading:false})
    }
}))