import axiosInstance from "@/app/api/axiosInstance";
import { create } from "zustand";

export const useSocial = create((set) => ({
  socials: [],
  loading: false,
  error: null,

  async getSocials() {
    try {
      set({ loading: true })
      const res = await axiosInstance.get('/social')
      set({ loading: false, socials: res.data })
    } catch (error) {
      set({ error: error, loading: false })
    }
  },

  async postSocial(payload) {
    const config = payload instanceof FormData 
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : {};

    const response = await axiosInstance.post('/social', payload, config);
    return response.data;
  },

  async deleteSocial(socialId){
    await axiosInstance.delete(`/social/${socialId}`)
  }
}))