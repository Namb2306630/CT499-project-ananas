import api from '@/api/axios'

export default {
  create(data) {
    return api.post('/admin/styles', data)
  },
  update(id, data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
    }

    return api.put(`/admin/styles/${id}`, payload)
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
  getOptions() {
    return api.get('/styles/options')
  },
}
