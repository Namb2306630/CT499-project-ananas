import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/brands/admin')
  },
  getAllForUser() {
    return api.get('/brands')
  },
  getLines(id) {
    return api.get(`/brands/${id}/lines`)
  },
  create(formData) {
    return api.post('/brands/admin', formData)
  },
  update(id, formData) {
    return api.put(`/brands/admin/${id}`, formData)
  },
  delete(id) {
    return api.delete(`/brands/admin/${id}`)
  },
  getById(id) {
    return api.get(`/brands/admin/${id}`)
  },
}
