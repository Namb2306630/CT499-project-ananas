import ProductTypeService from '@/services/product-type.service'
import { defineStore } from 'pinia'

export const useProductType = defineStore('product-types', {
  state: () => ({
    loading: false,
    productTypes: [],
    productType: {},
    productTypeOptions: [],
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),
  persist: {
    paths: ['productTypes', 'productType'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
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
        const res = await ProductTypeService.create(data)

        this.productTypes.unshift(res.data.result)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async update(id, data) {
      try {
        this.clearError()
        const res = await ProductTypeService.update(id, data)

        const index = this.productTypes.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.productTypes[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await ProductTypeService.delete(id)

        this.productTypes = this.productTypes.filter((item) => item._id !== id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi xóa dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async fetchForUser() {
      try {
        this.loading = true
        this.clearError()
        const res = await ProductTypeService.getAllForUser()
        this.productTypes = Array.isArray(res.data.result) ? res.data.result : []
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchForAdmin() {
      try {
        this.loading = true
        this.clearError()
        const res = await ProductTypeService.getAllForAdmin()

        this.productTypes = Array.isArray(res.data.result) ? res.data.result : []
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async getBySlug(slug) {
      try {
        this.clearError()
        const res = await ProductTypeService.getBySlug(slug)

        this.productType = res.data.result ?? {}

        return this.productType
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cho loại sản phẩm!',
          errors: data?.errors || {},
        }
        return null
      } finally {
        this.loading = false
      }
    },
    async fetchOptions() {
      try {
        const res = await ProductTypeService.getOptions()
        this.productTypeOptions = res.data.result
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
