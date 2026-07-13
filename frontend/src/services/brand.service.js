import api from '@/api/axios'

export default {
  getAll() {
    return api.get('/admin/brands')
  },
  getAllForUser() {
    return api.get('/brands')
  },
  getLines(id) {
    return api.get(`/brands/${id}/lines`)
  },
  create(form) {
    //một đối tượng trong JavaScript dùng để đóng gói dữ liệu theo định dạng multipart/form-data, thường dùng khi gửi form có file (ảnh, video, PDF...) lên server.
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('logo', form.image)
    formData.append('description', form.description)

    return api.post('/admin/brands', formData)
  },
  update(id, form) {
    const formData = new FormData()

    formData.append('name', form.name)
    formData.append('slug', form.slug)
    formData.append('isActive', form.isActive)
    formData.append('description', form.description)
    if (form.logo) {
      formData.append('logo', form.logo)
    }
    return api.put(`/admin/brands/${id}`, formData)
  },
  delete(id) {
    return api.delete(`/admin/brands/${id}`)
  },
  getBySlug(slug) {
    return api.get(`/admin/brands/${slug}`)
  },
}
