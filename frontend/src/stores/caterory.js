import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
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
        const res = await api.get('/categories/admin')
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
        const res = await api.post('/categories/admin', formData)
        this.categories.push(res.data.result)
        return true
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Thêm danh mục thất bại!',
          errors: data?.errors || {},
        }
        return false
      }
    },

    async updateCategory(id, form) {
      try {
        this.clearError()
        const formData = new FormData()
        formData.append('name', form.name)
        if (form.image) {
          formData.append('image', form.image)
        }

        const res = await api.put(`/categories/admin/${id}`, formData)
        const index = this.categories.findIndex((item) => item._id === id)
        if (index !== -1) {
          this.categories[index] = res.data.result
        }
        return true
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

    async deleteCategory(id) {
      try {
        this.clearError()
        const res = await api.delete(`/categories/admin/${id}`)
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
  },
})
