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
    async clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },
    // Lấy thông tin user hiện tại
    async getMe() {
      try {
        const res = await service.getMe()

        this.user = res.data.result

        return this.user
      } catch (error) {
        const status = error.response?.status

        // Chưa đăng nhập → bình thường
        if (status === 401) {
          this.user = null
          return null
        }

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

    async register(payload) {
      this.loading = true
      this.clearError()

      const startTime = Date.now()

      try {
        const res = await service.register(payload)

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo tài khoản, vui lòng thử lại sau!',
          errors: data?.errors || {},
        }

        return null
      } finally {
        const elapsed = Date.now() - startTime

        if (elapsed < 300) {
          await new Promise((resolve) => {
            setTimeout(resolve, 300 - elapsed)
          })
        }

        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      this.clearError()
      const startTime = Date.now()
      try {
        const res = await service.login(payload)
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi đăng nhập, vui lòng thử lại sau!',
          errors: data?.errors || {},
        }

        return null
      } finally {
        const elapsed = Date.now() - startTime
        if (elapsed < 300) {
          await new Promise((resolve) => {
            setTimeout(resolve, 300 - elapsed)
          })
        }
        this.loading = false
      }
    },
  },
})
