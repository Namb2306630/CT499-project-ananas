import api from '@/api/axios'

export default {
  get() {
    return api.get('/addresses')
  },

  getById(id) {
    return api.get(`/addresses/${id}`)
  },

  create(form) {
    return api.post('/addresses', form)
  },

  update(id, form) {
    return api.put(`/addresses/${id}`, form)
  },

  delete(id) {
    return api.delete(`/addresses/${id}`)
  },

  patch(id) {
    return api.patch(`/addresses/${id}/default`)
  },
}
