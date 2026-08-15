import api from '@/api/axios'

export default {
  get() {
    return api.get('/admin/system-config')
  },
  getForUser() {
    return api.get('/system-config')
  },
  update(data) {
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
    return api.put('/admin/system-config', payload)
  },

  updateImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    return api.put('/admin/system-config/not-found-image', formData)
  },
}
