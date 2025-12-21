import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useUserData = create((set)=>({
    userData: {},
    loading:false,
    error:null,
    getUserData : async  () =>{
       try{
        set({loading:true})
        const res = await axiosInstance.get('/user/me')
        set({userData:res.data , loading:false})
       }catch(err){
        set({loading:false, error:err.message})
       }
    },
    putUserData : async (editData) =>{
       try{
        set({loading:true})
        const res = await axiosInstance.put('/user/profile',editData)
        set({userData:res.data , loading:false})
       }catch(err){
        set({loading:false, error:err.message})
       }
    },
}))