import { defineStore } from 'pinia'
import service from '@/services/product-variant.service'

export const useProductVariant = defineStore('product-variants', {
  state: () => ({
    loading: false,
    productVariants: [],
    productVariantOptions: [],
    productVariant: {},
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),
  // persist: {
  //   paths: ['productVariants'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
  // },

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

        const res = await service.create(data)
        this.productVariants.unshift(res.data.result)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu cho biến thể sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async update(id, data) {
      try {
        this.clearError()
        const res = await service.update(id, data)
        const index = this.productVariants.findIndex((item) => item._id === id)
        if (index !== -1) {
          this.productVariants[index] = res.data.result
        }
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cho biến thể sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await service.delete(id)
        // this.productVariants = this.productVariants.filter((item) => item._id !== id)
        const index = this.productVariants.findIndex((item) => item._id === id)
        if (index !== -1) {
          this.productVariants[index] = res.data.result
        }
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi xó dữ liệu biến thể sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async fetchForAdmin() {
      try {
        this.clearError()
        const res = await service.getForAdmin()
        this.productVariants = Array.isArray(res.data.result) ? res.data.result : []
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách biến thể sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = true
      }
    },
    async fetchForUser() {
      try {
        this.clearError()
        const res = await service.getForUser()
        this.productVariants = Array.isArray(res.data.result) ? res.data.result : []
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách biến thể sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = true
      }
    },
    async getById(id) {
      try {
        this.clearError()
        this.loading = true
        const res = await service.getById(id)
        this.productVariant = res.data.result ?? {}
        return this.productVariant
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu biến thể sản phẩm!',
          errors: data?.errors || {},
        }
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async getDetailForUser(id) {
      try {
        this.clearError()
        this.loading = true
        const res = await service.getDetailForUser(id)
        this.productVariant = res.data.result ?? {}
        return this.productVariant
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu biến thể sản phẩm!',
          errors: data?.errors || {},
        }
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async fetchOptions(productId) {
      try {
        const res = await service.fetchOptions(productId)
        this.productVariantOptions = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu!',
          errors: data?.errors || {},
        }
      }
    },
  },
})
