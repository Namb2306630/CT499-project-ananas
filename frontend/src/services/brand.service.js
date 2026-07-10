import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/brands')
  },
  getAllForUser() {
    return api.get('/brands')
  },
  getLines(id) {
    return api.get(`/brands/${id}/lines`)
  },
  create(formData) {
    return api.post('/admin/brands', formData)
  },
  update(id, formData) {
    return api.put(`/admin/brands/${id}`, formData)
  },
  delete(id) {
    return api.delete(`/admin/brands/${id}`)
  },
  getBySlug(slug) {
    return api.get(`/admin/brands/${slug}`)
  },
}
