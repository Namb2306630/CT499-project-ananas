import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/product-lines')
  },
  getAllForUser() {
    return api.get('/product-lines')
  },
  create(formData) {
    return api.post('/admin/product-lines', formData)
  },
  update(id, data) {
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      brand: data.brand,
      isActive: data.isActive,
    }
    return api.put(`/admin/product-lines/${id}`, payload)
  },
  delete(id) {
    return api.delete(`/admin/product-lines/${id}`)
  },
  getBySlug(slug) {
    return api.get(`/admin/product-lines/${slug}`)
  },
  getProductsByProductLine(id) {
    return api.get(`/product-lines/${id}/products`)
  },
}
