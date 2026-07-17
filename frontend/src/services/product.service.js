import api from '@/api/axios'

export default {
  create(data) {
    data.costPrice = Number(data.costPrice)
    data.discountPercent = Number(data.discountPercent || 0)
    return api.post('/admin/products', data)
  },
  update(id, data) {
    return api.put(`/admin/products/${id}`, data)
  },
  delete(id) {
    return api.delete(`/admin/products/${id}`)
  },
  fetchForAdmin(page = 1) {
    return api.get(`/admin/products?page=${page}`)
  },
  fetchForUser() {
    return api.get('/products')
  },
  getBySlug(slug) {
    return api.get(`/admin/products/${slug}`)
  },
}
