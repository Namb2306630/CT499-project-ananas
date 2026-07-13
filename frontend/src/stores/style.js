import { defineStore } from 'pinia'
import StyleService from '@/services/style.service'

export const useStyleStore = defineStore('style', {
  state: () => ({
    loading: false,
    styles: [],
    style: null,
    error: {
      code: null,
      errors: {},
      general: '',
    },
  }),
  persist: {
    paths: ['styles', 'style'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
  },
  actions: {
    clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },
    async create(data) {
      try {
        this.clearError()

        const res = await StyleService.create(data)

        this.styles.unshift(res.data.result)

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          errors: data?.errors || {},
          general: data?.message || 'Lỗi tạo dữ liệu cho kiểu dáng sản phẩm',
        }
      }
    },

    async update(id, data) {
      try {
        this.clearError()

        const res = await StyleService.update(id, data)

        const index = this.styles.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.styles[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const res = error.response?.data
        this.error = {
          code: res?.code || 500,
          general: res?.message || 'Lỗi cập nhật dữ liệu cho kiểu dáng sản phẩm',
          errors: res?.errors || {},
        }
      }
    },
    async delete(id) {
      try {
        this.clearError()
        const res = await StyleService.remove(id)

        this.styles = this.styles.filter((item) => item._id != id)

        return res.data
      } catch (error) {
        const res = error.response?.data
        this.error = {
          code: res?.code || 500,
          general: res?.message || 'Lỗi xóa dữ liệu cho kiểu dáng sản phẩm',
          errors: res?.errors || {},
        }
      }
    },

    async fetchForAdmin() {
      try {
        // localStorage.clear()
        this.clearError()
        this.loading = true
        const res = await StyleService.fetchForAdmin()
        this.styles = res.data.result
      } catch (error) {
        const res = error.response?.data
        this.error = {
          code: res?.code || 500,
          general: res?.message || 'Lỗi lấy danh sách kiểu dáng sản phẩm',
          errors: res?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchForUser() {
      try {
        this.clearError()
        this.loading = true
        const res = await StyleService.fetchForUser()

        this.styles = res.data.result
      } catch (error) {
        const res = error.response?.data
        this.error = {
          code: res?.code || 500,
          general: res?.message || 'Lỗi lấy danh sách kiểu dáng sản phẩm',
          errors: res?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async getBySlug(slug) {
      try {
        this.loading = true
        this.clearError()
        const res = await StyleService.getBySlug(slug)

        this.style = res.data.result

        return this.style
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy kiểu dáng sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },
  },
})
