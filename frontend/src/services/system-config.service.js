import api from '@/api/axios'

export default {
  get() {
    return api.get('/admin/system-config')
  },
  update(data) {
    return api.put('/admin/system-config', data)
  },

  updateImage(file) {
    const formData = new FormData()
    formData.append('image', file)

    return api.put('/admin/system-config/not-found-image', formData)
  },
}
