import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    showProductMenu: false,
    showOrderMenu: false,
    showUserMenu: false,
    showSystemConfigMenu: false,
  }),

  persist: true,
})
