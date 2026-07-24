import ProductService from '@/services/product.service'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    loading: false,
    products: [],
    productOptions: [],
    product: {},
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false,
    },
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),
  persist: {
    paths: ['products', 'product'],
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
        const res = await ProductService.create(data)

        this.products.unshift(res.data.result)
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu cho sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async update(id, data) {
      try {
        this.clearError()
        const res = await ProductService.update(id, data)

        const index = this.products.findIndex((item) => item._id === id)

        this.products[index] = res.data.result

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cho sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await ProductService.delete(id)

        this.products = this.products.filter((item) => item._id !== id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi xóa sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async getBySlug(slug) {
      try {
        this.clearError()
        this.loading = true
        const res = await ProductService.getBySlug(slug)

        this.product = res.data.result ?? {}
        return this.product
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu sản phẩm!',
          errors: data?.errors || {},
        }
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async fetchForAdmin(page = 1) {
      try {
        this.clearError()
        this.loading = true

        const res = await ProductService.fetchForAdmin(page)

        this.products = Array.isArray(res.data.result.products) ? res.data.result.products : []
        this.pagination = res.data.result.pagination
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchForUser() {
      try {
        this.clearError()
        this.loading = true
        const res = await ProductService.fetchForUser()

        this.products = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchOptions() {
      try {
        const res = await ProductService.fetchOptions()
        this.productOptions = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
  },
})
