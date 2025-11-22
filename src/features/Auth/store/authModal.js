import { create } from "zustand";

const useAuthModalStore = create((set) => ({
  // Состояние модалок
  modalAuthLogin: false,
  modalAuthRegistr: false,

  // Контекст для регистрации
  prefillEmail: "",
  flowSource: null, // например: 'home' — открыто с главной

  // ===== Открыть/закрыть ЛОГИН =====
  // Новый нейминг:
  openModalAuthLogin: () =>
    set({
      modalAuthLogin: true,
      modalAuthRegistr: false,
      // не трогаем prefillEmail/flowSource — пусть живут до закрытия регистрации
    }),
  // Сохранён старый нейминг для совместимости:
  openModalAuthState: () =>
    set({
      modalAuthLogin: true,
      modalAuthRegistr: false,
    }),

  closeModalAuthState: () =>
    set({
      modalAuthLogin: false,
    }),

  // ===== Открыть/закрыть РЕГИСТРАЦИЮ =====
  // Теперь может принимать payload: { prefillEmail?: string, source?: string }
  openModalAuthRegistr: (payload = {}) => {
    const { prefillEmail = "", source = null } = payload || {};
    set({
      modalAuthRegistr: true,
      modalAuthLogin: false,
      prefillEmail,
      flowSource: source,
    });
  },

  // При закрытии регистрации чистим контекст
  closeModalAuthRegistr: () =>
    set({
      modalAuthRegistr: false,
      prefillEmail: "",
      flowSource: null,
    }),
}));

export default useAuthModalStore;
