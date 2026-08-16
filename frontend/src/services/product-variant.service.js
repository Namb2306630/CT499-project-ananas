import api from '@/api/axios'

export default {
  create(data) {
    const formData = new FormData()

    formData.append('_id', data._id)
    formData.append('product', data.product)
    formData.append('colorName', data.colorName)
    formData.append('colorCode', data.colorCode)
    if (data.mainImage instanceof File) {
      formData.append('mainImage', data.mainImage)
    }

    if (data.hoverImage instanceof File) {
      formData.append('hoverImage', data.hoverImage)
    }

    data.images.forEach((image) => {
      formData.append('images', image)
    })

    return api.post('/admin/product-variants', formData)
  },

  update(id, data) {
    const formData = new FormData()

    formData.append('product', data.product)
    formData.append('colorName', data.colorName)
    formData.append('colorCode', data.colorCode)
    formData.append('status', data.status)

    if (data.mainImage instanceof File) {
      formData.append('mainImage', data.mainImage)
    }

    if (data.hoverImage instanceof File) {
      formData.append('hoverImage', data.hoverImage)
    }

    data.images.forEach((image) => {
      formData.append('images', image)
    })

    return api.put(`/admin/product-variants/${id}`, formData)
  },
  delete(id) {
    return api.delete(`/admin/product-variants/${id}`)
  },
  getForAdmin() {
    return api.get('/admin/product-variants')
  },
  getForUser() {
    return api.get('/product-variants')
  },

  getById(id) {
    return api.get(`/admin/product-variants/${id}`)
  },

  fetchOptions(productId) {
    return api.get('/product-variants/options', {
      params: {
        productId,
      },
    })
  },

  getDetailForUser(id) {
    return api.get(`/product-variants/${id}`)
  },
}
