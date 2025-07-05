import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return { theme: newTheme }
    })
  },
}))