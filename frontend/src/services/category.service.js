import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/categories')
  },

  getAllForUser() {
    return api.get('/categories')
  },

  getBySlug(slug) {
    return api.get(`/admin/categories/${slug}`)
  },

  create(formData) {
    return api.post('/admin/categories', formData)
  },

  update(id, formData) {
    return api.put(`/admin/categories/${id}`, formData)
  },

  delete(id) {
    return api.delete(`/admin/categories/${id}`)
  },
}
