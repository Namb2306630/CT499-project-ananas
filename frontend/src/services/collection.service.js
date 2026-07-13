import api from '@/api/axios'

export default {
  async create(data) {
    return api.post('/admin/collections', data)
  },

  async update(id, data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
    }
    return api.put(`/admin/collections/${id}`, payload)
  },

  async delete(id) {
    return api.delete(`/admin/collections/${id}`)
  },

  async fetchForAdmin() {
    return api.get('/admin/collections')
  },

  async fetchForUser() {
    return api.get('/collections')
  },
  async getBySlug(slug) {
    return api.get(`/admin/collections/${slug}`)
  },
}
