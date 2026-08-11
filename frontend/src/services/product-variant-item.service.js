import api from '../api/axios.js'

export default {
  create(data) {
    return api.post('admin/product-variant-items', data)
  },
  update(id, data) {
    const payload = {
      variant: data.variant,
      size: data.size,
      stock: data.stock,
      status: data.status,
    }
    return api.put(`/admin/product-variant-items/${id}`, payload)
  },
  delete(id) {
    return api.delete(`/admin/product-variant-items/${id}`)
  },
  getBySku(sku) {
    return api.get(`/admin/product-variant-items/${sku}`)
  },
  fetchForAdmin() {
    return api.get('/admin/product-variant-items')
  },
}
