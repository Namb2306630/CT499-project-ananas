import api from '@/api/axios'

const create = async (payload) => {
  const response = await api.post('/orders', payload)
  return response.data
}

const getAll = async () => {
  const response = await api.get('/orders')
  return response.data
}

const getById = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

const getByUser = async () => {
  const response = await api.get('/orders/user')
  return response.data
}

const update = async (id, payload) => {
  const response = await api.put(`/orders/${id}`, payload)
  return response.data
}

const cancel = async (id) => {
  const response = await api.patch(`/orders/${id}/cancel`)
  return response.data
}

const updateStatus = async (orderCode, orderStatus) => {
  const response = await api.patch(`/orders/${orderCode}/status`, {
    orderStatus,
  })

  return response.data
}

export default {
  create,
  getAll,
  getById,
  getByUser,
  update,
  cancel,
  updateStatus,
}
