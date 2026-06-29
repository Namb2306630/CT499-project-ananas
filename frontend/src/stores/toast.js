import { defineStore } from 'pinia'

let timer

export const useToastStore = defineStore('toast', {
  state: () => ({
    message: '',
    type: 'success',
    show: false,
  }),

  actions: {
    showToast(message, type = 'success') {
      this.message = message
      this.type = type
      this.show = true

      clearTimeout(timer)

      timer = setTimeout(() => {
        this.show = false
      }, 3000)
    },
  },
})
