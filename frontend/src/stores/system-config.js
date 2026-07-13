import SystemConfigService from '@/services/system-config.service'
import { defineStore } from 'pinia'

export const useSystemConfigStore = defineStore('system-config', {
  state: () => ({
    systemConfig: null,
    loading: false,
    error: {
      code: null,
      errors: {},
      general: '',
    },
  }),
  persist: {
    paths: ['systemConfig'],
  },
  actions: {
    clearError() {
      this.error = {
        code: null,
        general: '',
        errors: {},
      }
    },
    async get() {
      try {
        this.clearError()
        this.loading = true
        const res = await SystemConfigService.get()

        this.systemConfig = res.data.result
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi lấy dữ liệu cấu hình hệ thống',
          errors: data?.errors || {},
        }
      } finally {
        this.loading = false
      }
    },

    async update(data) {
      try {
        this.clearError()
        const payload = {
          taxCode: data.taxCode,
          email: data.email,
          hotline: data.hotline,
          vatRate: data.vatRate,
          operatingCostPercent: data.operatingCostPercent,
          profitPercent: data.profitPercent,
          freeShippingThreshold: data.freeShippingThreshold,
          currency: data.currency,
          taxDisplayStrategy: data.taxDisplayStrategy,
        }

        const res = await SystemConfigService.update(payload)

        this.systemConfig = res.data.result
        return res.data
      } catch (error) {
        const data = error.response?.data
        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật dữ liệu cấu hình hệ thống',
          errors: data?.errors || {},
        }
      }
    },

    async updateImage(file) {
      try {
        this.clearError()

        const res = await SystemConfigService.updateImage(file)

        this.systemConfig = res.data.result

        return res.data
      } catch (error) {
        const data = error.response?.data

        this.error = {
          code: data?.code || 500,
          general: data?.message || 'Lỗi cập nhật ảnh',
          errors: data?.errors || {},
        }
      }
    },
  },
})
