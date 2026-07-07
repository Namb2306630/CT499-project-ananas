import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/categories/admin')
  },

  getAllForUser() {
    return api.get('/categories')
  },

  getById(id) {
    return api.get(`/categories/admin/${id}`)
  },

  create(formData) {
    return api.post('/categories/admin', formData)
  },

  update(id, formData) {
    return api.put(`/categories/admin/${id}`, formData)
  },

  delete(id) {
    return api.delete(`/categories/admin/${id}`)
  },
}
