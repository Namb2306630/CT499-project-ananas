import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import addressApi from '@/services/address.service'

export const useAddressStore = defineStore('address', () => {
  const addresses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const defaultAddress = computed(() => {
    return addresses.value.find((item) => item.isDefault)
  })

  const fetchAddresses = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await addressApi.get()

      addresses.value = response.data?.result || []

      return response
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const createAddress = async (form) => {
    loading.value = true
    error.value = null

    try {
      const response = await addressApi.create(form)

      addresses.value = response.data?.result
        ? [...addresses.value, response.data.result]
        : addresses.value

      await fetchAddresses()

      return response
    } catch (err) {
      error.value = err

      console.error('CREATE ADDRESS ERROR:', err.response?.data || err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAddress = async (id, form) => {
    loading.value = true
    error.value = null

    try {
      const response = await addressApi.update(id, form)

      await fetchAddresses()

      return response
    } catch (err) {
      error.value = err

      console.error('UPDATE ADDRESS ERROR:', err.response?.data || err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAddress = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await addressApi.delete(id)

      addresses.value = addresses.value.filter((item) => item._id !== id)

      return response
    } catch (err) {
      error.value = err

      console.error('DELETE ADDRESS ERROR:', err.response?.data || err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const setDefaultAddress = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await addressApi.patch(id)

      await fetchAddresses()

      return response
    } catch (err) {
      error.value = err

      console.error('SET DEFAULT ADDRESS ERROR:', err.response?.data || err)

      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    addresses,
    loading,
    error,
    defaultAddress,

    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  }
})
