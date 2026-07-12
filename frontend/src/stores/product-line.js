import { defineStore } from 'pinia'
import ProductLineService from '@/services/product-line.service'

export const useProductLineStore = defineStore('product-line', {
  state: () => ({
    loading: false,
    productLine: null,
    productLines: [],
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),
  persist: {
    paths: ['productLines', 'productLine'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
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
        const res = await ProductLineService.create(data)

        this.productLines.unshift(res.data.result)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu cho dòng sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
    async update(id, data) {
      try {
        this.clearError()
        const payload = {
          name: data.name,
          slug: data.slug,
          description: data.description,
          brand: data.brand,
          isActive: data.isActive,
        }

        const res = await ProductLineService.update(id, payload)

        const index = this.productLines.findIndex((item) => item._id == id)

        if (index !== -1) {
          this.productLines[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu thương hiệu!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await ProductLineService.delete(id)

        this.productLines = this.productLines.filter((item) => item._id != id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi xóa dữ liệu thương hiệu!',
          errors: data?.errors || {},
        }
      }
    },

    async getBySlug(slug) {
      try {
        this.loading = true
        this.clearError()
        const res = await ProductLineService.getBySlug(slug)

        this.productLine = res.data.result

        return this.productLine
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dòng sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchForUser() {
      try {
        this.loading = true
        this.clearError()
        const res = await ProductLineService.getAllForUser()
        this.productLines = res.data.result

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu dòng sản phẩm!',
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
        const res = await ProductLineService.getAll()
        this.productLines = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu dòng sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },
  },
})
