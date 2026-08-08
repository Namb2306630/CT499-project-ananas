import service from '@/services/product-variant-item.service'
import { defineStore } from 'pinia'

export const useProductVariItem = defineStore('product-variant-items', {
  state: () => ({
    loading: false,
    productVariItems: [],
    productVariItem: {},
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
    async create(data) {
      try {
        this.clearError()
        const res = await service.create(data)
        this.productVariItems.unshift(...res.data.result)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu cho sku sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
    async update(id, data) {
      try {
        this.clearError()
        const res = await service.update(id, data)

        const index = this.productVariItems.findIndex((item) => item._id === id)
        if (index !== -1) {
          this.productVariItems[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cho sku sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
    async delete(id) {
      try {
        this.clearError()
        const res = await service.delete(id)
        // this.productVariItems = this.productVariItems.filter((item) => item._id !== id)

        const index = this.productVariItems.findIndex((item) => item._id === id)
        if (index !== -1) {
          this.productVariItems[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi xóa dữ liệu cho sku sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
    async getBySku(sku) {
      try {
        this.clearError()
        const res = await service.getBySku(sku)

        this.productVariItem = res.data.result ?? {}

        return this.productVariItem
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cho sku sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async fetchForAdmin() {
      try {
        this.clearError()
        this.loading = true
        const res = await service.fetchForAdmin()

        this.productVariItems = Array.isArray(res.data.result) ? res.data.result : []

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cho sku sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = true
      }
    },
  },
})
