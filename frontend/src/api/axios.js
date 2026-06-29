import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

// ==================================
// TẠO AXIOS INSTANCE
// ==================================

const api = axios.create({
  baseURL: BASE_URL,

  // cho phép gửi cookie lên BE
  withCredentials: true,
})

// ==================================
// REFRESH TOKEN STATE
// ==================================

// kiểm tra đang refresh hay không
let isRefreshing = false

// lưu request đang chờ token mới
let queue = []

// thêm request vào queue

const addQueue = (callback) => {
  queue.push(callback)
}

// chạy các request sau khi refresh xong

const runQueue = () => {
  queue.forEach((callback) => {
    callback()
  })

  queue = []
}

// ==================================
// RESPONSE INTERCEPTOR
// ==================================

api.interceptors.response.use(
  // request thành công

  (response) => {
    return response
  },

  // request lỗi

  async (error) => {
    const oldRequest = error.config

    // chỉ xử lý 401
    // và request chưa retry

    if (error.response?.status === 401 && !oldRequest._retry) {
      oldRequest._retry = true

      // ==================================
      // ĐANG CÓ REQUEST REFRESH
      // ==================================

      if (isRefreshing) {
        //đảm bảo các yêu cầu cần token đợi để được cấp token mới
        //tránh bị đá ra khi token hết hạn
        return new Promise((resolve) => {
          addQueue(() => {
            resolve(api(oldRequest))
          })
        })
      }

      // ==================================
      // REQUEST ĐẦU TIÊN REFRESH
      // ==================================

      isRefreshing = true

      try {
        // KHÔNG GỬI REFRESH TOKEN
        // COOKIE TỰ ĐƯỢC GỬI

        await axios.post(
          `${BASE_URL}/auth/refresh`,

          {}, //Không gửi dữ liệu trong body.

          {
            withCredentials: true, //cho phép browser gửi cookie kèm request
          },
        )

        // báo cho các request đang chờ

        runQueue()

        // chạy lại request đầu tiên

        return api(oldRequest)
      } catch (err) {
        // refresh thất bại

        globalThis.location.href = '/login'

        throw err
      } finally {
        isRefreshing = false
      }
    }

    throw error
  },
)

export default api
