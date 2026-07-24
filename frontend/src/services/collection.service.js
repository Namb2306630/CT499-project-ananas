import api from '@/api/axios'

export default {
  create(data) {
    return api.post('/admin/collections', data)
  },

  update(id, data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
    }
    return api.put(`/admin/collections/${id}`, payload)
  },

  delete(id) {
    return api.delete(`/admin/collections/${id}`)
  },

  fetchForAdmin() {
    return api.get('/admin/collections')
  },

  fetchForUser() {
    return api.get('/collections')
  },
  getBySlug(slug) {
    return api.get(`/admin/collections/${slug}`)
  },
  getOptions() {
    return api.get('/collections/options')
  },
}
