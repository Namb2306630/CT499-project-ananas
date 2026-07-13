import { defineStore } from 'pinia'
import BrandService from '@/services/brand.service'

export const useBrandStore = defineStore('brand', {
  state: () => ({
    brands: [],
    brand: null,
    productLines: [],
    loading: false,
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),

  persist: {
    paths: ['brands', 'brand'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
  },

  actions: {
    clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },
    async createBrand(form) {
      try {
        this.clearError()
        const res = await BrandService.create(form)
        this.brands.unshift(res.data.result)
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu thương hiệu!',
          errors: data?.errors || {},
        }
      }
    },

    async updateBrand(id, form) {
      try {
        this.clearError()

        const res = await BrandService.update(id, form)
        const index = this.brands.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.brands[index] = res.data.result
        }
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cho thương hiệu!',
          errors: data?.errors || {},
        }
      }
    },
    async fetchAdminBrands() {
      try {
        this.loading = true
        this.clearError()

        const res = await BrandService.getAll()

        this.brands = res.data.result
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách thương hiệu!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async fetchBrandsForUser() {
      try {
        this.loading = true
        this.clearError()
        const res = await BrandService.getAllForUser()
        this.brands = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách thương hiệu!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async getBySlug(slug) {
      try {
        this.loading = true
        this.clearError()
        const res = await BrandService.getBySlug(slug)

        this.brand = res.data.result

        return this.brand
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy thương hiệu!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await BrandService.delete(id)
        this.brands = this.brands.filter((item) => item._id != id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy xóa thương hiệu!',
          errors: data?.errors || {},
        }
      }
    },
    async fetchProductLines(id) {
      try {
        this.loading = true
        this.clearError()

        const res = await BrandService.getLines(id)

        this.productLines = res.data.result

        return this.productLines
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy danh sách dòng sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },
  },
})
