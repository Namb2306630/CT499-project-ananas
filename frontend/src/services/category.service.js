import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/categories')
  },

  getAllForUser() {
    return api.get('/categories')
  },

  getBySlug(slug) {
    return api.get(`/admin/categories/${slug}`)
  },

  create(form) {
    const formData = new FormData()

    formData.append('name', form.name)
    if (form.parent) {
      formData.append('parent', form.parent)
    }
    if (form.image) {
      formData.append('image', form.image)
    }

    return api.post('/admin/categories', formData)
  },

  update(id, form) {
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('slug', form.slug)
    formData.append('isActive', form.isActive)

    if (form.parent) {
      formData.append('parent', form.parent)
    }

    if (form.image) {
      formData.append('image', form.image)
    }
    
    return api.put(`/admin/categories/${id}`, formData)
  },

  delete(id) {
    return api.delete(`/admin/categories/${id}`)
  },
}
