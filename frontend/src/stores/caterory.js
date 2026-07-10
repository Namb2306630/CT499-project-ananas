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

        const formData = new FormData()

        formData.append('name', form.name)

        if (form.parent) {
          formData.append('parent', form.parent)
        }

        if (form.image) {
          formData.append('image', form.image)
        }

        const res = await CategoryService.create(formData)

        this.categories.push(res.data.result)

        return {
          success: true,
          message: res.data.message,
        }
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Thêm danh mục thất bại!',
          errors: data?.errors || {},
        }

        return {
          success: false,
        }
      }
    },

    async updateCategory(id, form) {
      try {
        this.clearError()

        const formData = new FormData()

        formData.append('name', form.name)
        formData.append('slug', form.slug)
        formData.append('isActive', form.isActive)

        if (form.parent) {
          formData.append('parent', form.parent)
        }

        if (form.image) {
          formData.append('image', form.image)
        }

        const res = await CategoryService.update(id, formData)

        const index = this.categories.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.categories[index] = res.data.result
        }
        return {
          success: true,
          message: res.data.message,
        }
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Cập nhật thất bại!',
          errors: data?.errors || {},
        }

        return {
          success: false,
        }
      }
    },

    async deleteCategory(id) {
      try {
        this.clearError()
        const res = await CategoryService.delete(id)
        this.categories = this.categories.filter((item) => item._id !== id)
        return res.data.message
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
