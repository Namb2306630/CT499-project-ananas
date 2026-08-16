import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/carts')
  },

  create(form) {
    return api.post('/carts', form)
  },

  update(id, form) {
    return api.put(`/carts/${id}`, form)
  },

  delete(id) {
    return api.delete(`/carts/${id}`)
  },
  deleteAll() {
    return api.delete('/carts')
  },
}
