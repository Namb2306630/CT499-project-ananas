import api from '@/api/axios'

export default {
  create(data) {
    return api.post('/admin/styles', data)
  },
  update(id, data) {
    return api.put(`/admin/styles/${id}`, data)
  },
  remove(id) {
    return api.delete(`/admin/styles/${id}`)
  },
  fetchForUser() {
    return api.get('/styles')
  },
  fetchForAdmin() {
    return api.get('/admin/styles')
  },
  getBySlug(slug) {
    return api.get(`/admin/styles/${slug}`)
  },
}
