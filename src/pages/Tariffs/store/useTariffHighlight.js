// @/features/Tariffs/store/useTariffHighlight.js
import { create } from "zustand";

const useTariffHighlight = create((set) => ({
  highlightedTariffId: null,
  setHighlightedTariffId: (id) => set({ highlightedTariffId: id }),
  toggleHighlightedTariff: (id) =>
    set((state) => ({
      highlightedTariffId:
        state.highlightedTariffId === id ? null : id,
    })),
}));

export default useTariffHighlight;
