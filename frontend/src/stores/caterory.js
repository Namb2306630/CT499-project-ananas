import { defineStore } from 'pinia'
import CategoryService from '@/services/category.service'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    category: null,
    loading: false,
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),

  persist: {
    paths: ['categories', 'category'], // những biến nào trong state được lưu lại thay vì lưu toàn bộ
  },

  actions: {
    clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },

    async fetchCategories() {
      try {
        this.loading = true
        this.clearError()
        const res = await CategoryService.getAll()
        this.categories = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu danh mục!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async createCategories(form) {
      try {
        this.clearError()

        const res = await CategoryService.create(form)
        this.categories.unshift(res.data.result)
        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Thêm danh mục thất bại!',
          errors: data?.errors || {},
        }
      }
    },

    async updateCategory(id, form) {
      try {
        this.clearError()

        const res = await CategoryService.update(id, form)

        const index = this.categories.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.categories[index] = res.data.result
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

    async deleteCategory(id) {
      try {
        this.clearError()
        const res = await CategoryService.delete(id)
        this.categories = this.categories.filter((item) => item._id !== id)

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

    async getCategoryBySlug(slug) {
      try {
        this.loading = true
        this.clearError()

        const res = await CategoryService.getBySlug(slug)

        this.category = res.data.result
        return this.category
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu danh mục!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },
  },
})
