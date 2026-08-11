import { defineStore } from 'pinia' //quản lý state
import service from '@/services/auth.service'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),
  actions: {
    // Lấy thông tin user hiện tại
    async getMe() {
      try {
        const res = await service.getMe()

        this.user = res.data.result

        return this.user
      } catch (error) {
        const data = error.response?.data

        this.user = null

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy thông tin user!!!',
          errors: data?.errors || {},
        }

        throw error
      }
    },
    // Logout
    async logout() {
      try {
        await service.logout()
      } finally {
        this.user = null
      }
    },
  },
})
