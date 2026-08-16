import { defineStore } from 'pinia'
import service from '@/services/cart.service'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    carts: [],
    loading: false,
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),

  actions: {
    clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },

    async fetchCart() {
      try {
        this.loading = true
        this.clearError()
        const res = await service.getAll()
        this.carts = Array.isArray(res.data.result) ? res.data.result : []
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu giỏ hàng!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async create(form) {
      try {
        this.clearError()

        const res = await service.create(form)
        this.carts.unshift(res.data.result)
        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Thêm sản phẩm vào giỏ hàng thất bại!',
          errors: data?.errors || {},
        }
      }
    },

    async update(id, form) {
      try {
        this.clearError()

        const res = await service.update(id, form)

        const index = this.carts.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.carts[index] = res.data.result
        }
        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Cập nhật thất bại!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await service.delete(id)
        this.carts = this.carts.filter((item) => item._id !== id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Xóa thất bại!',
          errors: data?.errors || {},
        }
        return false
      }
    },
    async deleteAll() {
      try {
        this.clearError()
        const res = await service.deleteAll()
        this.carts = []

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Xóa thất bại!',
          errors: data?.errors || {},
        }
        return false
      }
    },
  },
})
