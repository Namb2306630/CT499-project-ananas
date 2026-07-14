import api from '@/api/axios'

export default {
  create(data) {
    return api.post('/admin/product-types', data)
  },
  update(id, data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
    }
    return api.put(`/admin/product-types/${id}`, payload)
  },
  delete(id) {
    return api.delete(`/admin/product-types/${id}`)
  },
  getBySlug(slug) {
    return api.get(`/admin/product-types/${slug}`)
  },

  getAllForUser() {
    return api.get('/product-types')
  },

  getAllForAdmin() {
    return api.get('/admin/product-types')
  },
}
