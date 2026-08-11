// axios.get('/user', {
//   withCredentials: true,
// })
// Browser tự gửi:

// Cookie:
// accessToken=eyJhbGciOiJI...

import api from '@/api/axios'

export default {
  getMe() {
    return api.get('/auth/me')
  },
  logout() {
    return api.post('/auth/logout')
  },
  register(data) {
    return api.post('/auth/register',data)
  },
  login(data) {
    return api.post('/auth/login',data)
  },
  forgotPassword(data) {
    return api.post('/auth/forgot-password',data)
  },
  refreshToken() {
    return api.post('/auth/refresh-token')
  },
}
