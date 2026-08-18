import { defineStore } from 'pinia'
import service from '@/services/cart.service'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: null,

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

    // Lấy giỏ hàng
    async fetchCart() {
      try {
        this.loading = true
        this.clearError()

        const res = await service.getAll()

        this.cart = res.data.result || null

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu giỏ hàng!',
          errors: data?.errors || {},
        }

        return false
      } finally {
        this.loading = false
      }
    },

    // Thêm sản phẩm vào giỏ
    async create(form) {
      try {
        this.clearError()

        const res = await service.create(form)

        // API create trả về toàn bộ Cart
        this.cart = res.data.result

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Thêm sản phẩm vào giỏ hàng thất bại!',
          errors: data?.errors || {},
        }

        return false
      }
    },

    // Cập nhật CartItem
    async update(id, form) {
      try {
        this.clearError()

        const res = await service.update(id, form)

        // API update trả về toàn bộ Cart
        this.cart = res.data.result

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Cập nhật thất bại!',
          errors: data?.errors || {},
        }

        return false
      }
    },

    // Xóa một CartItem
    async delete(id) {
      try {
        this.clearError()

        const res = await service.delete(id)

        // Backend removeId chỉ trả true,
        // nên tự xóa item khỏi cart hiện tại
        if (this.cart?.items) {
          this.cart.items = this.cart.items.filter((item) => item._id !== id)
        }

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

    // Xóa toàn bộ giỏ hàng
    async deleteAll() {
      try {
        this.clearError()

        const res = await service.deleteAll()

        if (this.cart) {
          this.cart.items = []
        }

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
