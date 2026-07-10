import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/product-lines')
  },
  getAllForUser() {
    return api.get('/product-lines')
  },
  create(formData) {
    return api.post('/admin/product-lines', formData)
  },
  update(id, formData) {
    return api.put(`/admin/product-lines/${id}`, formData)
  },
  delete(id) {
    return api.delete(`/admin/product-lines/${id}`)
  },
  getBySlug(slug) {
    return api.get(`/admin/product-lines/${slug}`)
  },
  getProductsByProductLine(id) {
    return api.get(`/product-lines/${id}/products`)
  },
}
