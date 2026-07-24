import api from '@/api/axios'

export default {
  create(data) {
    data.costPrice = Number(data.costPrice)
    data.discountPercent = Number(data.discountPercent || 0)
    return api.post('/admin/products', data)
  },
  update(id, data) {
    const payload = {
      description: data.description,
      categories: data.categories,

      productType: data.productType?._id || data.productType,
      productLine: data.productLine?._id || data.productLine,
      productCollection: data.productCollection?._id || data.productCollection,
      style: data.style?._id || data.style,
      defaultVariant: data.defaultVariant?._id || data.defaultVariant,

      costPrice: Number(data.costPrice),
      discountPercent: Number(data.discountPercent || 0),

      isBestSeller: data.isBestSeller,
      isNewArrival: data.isNewArrival,
      isSale: data.isSale,
      gender: data.gender,
      status: data.status,
    }

    return api.put(`/admin/products/${id}`, payload)
  },
  delete(id) {
    return api.delete(`/admin/products/${id}`)
  },
  fetchForAdmin(page = 1) {
    return api.get(`/admin/products?page=${page}`)
  },
  fetchForUser() {
    return api.get('/products')
  },
  getBySlug(slug) {
    return api.get(`/admin/products/${slug}`)
  },
  fetchOptions() {
    return api.get('/products/options')
  },
}
