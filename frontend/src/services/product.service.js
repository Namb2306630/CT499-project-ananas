import api from '@/api/axios'

export default {
  create(data) {
    return api.post('/admin/products', data)
  },
  update(id, data) {
    return api.put(`/admin/products/${id}`, data)
  },
  delete(id) {
    return api.delete(`/admin/products/${id}`)
  },
  fetchForAdmin() {
    return api.get('/admin/products')
  },
  fetchForUser() {
    return api.get('/products')
  },
  getBySlug(slug) {
    return api.get(`/admin/products/${slug}`)
  },
}
