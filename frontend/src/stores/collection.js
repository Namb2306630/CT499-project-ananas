import collectionService from '@/services/collection.service'
import { defineStore } from 'pinia'

export const useCollectionStore = defineStore('collecions', {
  state: () => ({
    collections: [],
    collection: null,
    loading: false,
    error: {
      code: null,
      general: '',
      errors: {},
    },
  }),

  persist: {
    paths: ['collections', 'collection'],
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
        const res = await collectionService.create(data)

        this.collections.unshift(res.data.result)
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu bộ sưu tập sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
    async update(id, data) {
      try {
        this.clearError()

        const res = await collectionService.update(id, data)

        const index = this.collections.findIndex((item) => item._id === id)

        if (index !== -1) {
          this.collections[index] = res.data.result
        }

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu bộ sưu tập sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async delete(id) {
      try {
        this.clearError()
        const res = await collectionService.delete(id)

        this.collections = this.collections.filter((item) => item._id !== id)

        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi tạo dữ liệu bộ sưu tập sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },

    async fetchForAdmin() {
      try {
        this.clearError()
        this.loading = true
        const res = await collectionService.fetchForAdmin()
        this.collections = res.data.result
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu bộ sưu tập sản phẩm!',
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
        const res = await collectionService.fetchForUser()
        this.collections = res.data.result
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu bộ sưu tập sản phẩm!',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },
    async getBySlug(slug) {
      try {
        this.clearError()

        const res = await collectionService.getBySlug(slug)

        this.collection = res.data.result

        return this.collection
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu bộ sưu tập sản phẩm!',
          errors: data?.errors || {},
        }
      }
    },
  },
})
