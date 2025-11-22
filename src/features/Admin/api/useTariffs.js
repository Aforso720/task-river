import { create } from "zustand";
import axiosInstance from "@/app/api/axiosInstance";

export const useTariffs = create((set, get) => ({
  tariffs: [],
  loading: false,
  error: null,

  loadingCreate: false,
  errorCreate: null,

  loadingDelete: false,
  errorDelete: null,

  loadingUpdate: false,
  errorUpdate: null,

  async getTariffs() {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/plans?custom=false");
      set({ tariffs: res.data ?? [], loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },

  async createTariff(payload) {
    try {
      set({ loadingCreate: true, errorCreate: null });
      const res = await axiosInstance.post("/plans/create", payload);
      await get().getTariffs();
      set({ loadingCreate: false });
      return res?.data;
    } catch (error) {
      set({ errorCreate: error, loadingCreate: false });
      throw error;
    }
  },

  async updateTariff(planId, payload) {
    if (!planId) return;
    try {
      set({ loadingUpdate: true, errorUpdate: null });
      const res = await axiosInstance.put(`/plans/${planId}`, payload);
      await get().getTariffs();
      set({ loadingUpdate: false });
      return res?.data;
    } catch (error) {
      set({ errorUpdate: error, loadingUpdate: false });
      throw error;
    }
  },

  async deleteTariff(planId) {
    if (!planId) return;
    try {
      set({ loadingDelete: true, errorDelete: null });
      await axiosInstance.delete(`/plans/${planId}`);
      await get().getTariffs();
      set({ loadingDelete: false });
    } catch (error) {
      set({ errorDelete: error, loadingDelete: false });
      throw error;
    }
  },
}));
