import { defineStore } from 'pinia'
import { ref } from 'vue'

import orderService from '@/services/order.service'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const order = ref(null)

  const loading = ref(false)
  const error = ref({
    code: null,
    general: '',
    errors: {},
  })

  const createOrder = async (payload) => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.create(payload)

      order.value = response.result

      return response.result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetError = () => {
    error.value = {
      code: null,
      general: '',
      errors: {},
    }
  }

  const fetchOrders = async () => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.getAll()

      orders.value = response.result || []

      return orders.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOrderById = async (id) => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.getById(id)

      order.value = response.result

      return order.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMyOrders = async () => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.getByUser()

      orders.value = response.result || []

      return orders.value
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (id) => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.cancel(id)

      return response.result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearOrder = () => {
    order.value = null
  }

  const updateStatus = async (orderCode, orderStatus) => {
    loading.value = true
    resetError()

    try {
      const response = await orderService.updateStatus(orderCode, orderStatus)

      const updatedOrder = response.result

      const index = orders.value.findIndex((order) => order.orderCode === orderCode)

      if (index !== -1) {
        orders.value[index] = {
          ...orders.value[index],
          ...updatedOrder,
        }
      }

      return response
    } catch (err) {
      error.value = {
        code: err.response?.data?.code || 500,
        general: err.response?.data?.message || err.message || 'Cập nhật trạng thái thất bại',
        errors: err.response?.data?.errors || {},
      }

      return null
    } finally {
      loading.value = false
    }
  }

  return {
    orders,
    order,
    loading,
    error,

    createOrder,
    fetchOrders,
    fetchOrderById,
    fetchMyOrders,
    cancelOrder,
    clearOrder,
    updateStatus,
  }
})
