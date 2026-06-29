import { defineStore } from 'pinia' //quản lý state
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null }),
  actions: {
    async getMe() {
      const res = await api.get('/auth/me')

      this.user = res.data.result
    },
  },
})
