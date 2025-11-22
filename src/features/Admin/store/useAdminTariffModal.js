import { create } from "zustand";

export const useAdminTariffModal = create((set) => ({
  modalState: false,
  modalVers: "Добавить тариф",
  editingTariff: null,      // полный объект тарифа (приоритетно)
  editingTariffId: null,    // или можно передать только id
  editingTariffName: null,  // или только name

  openModal: (version, payload = {}) => {
    const { editingTariff = null, editingTariffId = null, editingTariffName = null } = payload;
    set({
      modalState: true,
      modalVers: version,
      editingTariff,
      editingTariffId,
      editingTariffName,
    });
  },
  closeModal: () => {
    set({
      modalState: false,
      editingTariff: null,
      editingTariffId: null,
      editingTariffName: null,
    });
  },
}));
