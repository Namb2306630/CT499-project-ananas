// src/stores/province.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import provinceService from '@/services/province.service'

export const useProvinceStore = defineStore('province', () => {
  const provinces = ref([])
  const districts = ref([])
  const wards = ref([])

  const loading = ref(false)
  const error = ref(null)

  const fetchProvinces = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await provinceService.getProvinces()

      console.log('GET PROVINCES:', response.data)

      provinces.value = response.data?.result || response.data || []
    } catch (err) {
      error.value = err
      provinces.value = []

      console.error('FETCH PROVINCES ERROR:', err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDistricts = async (provinceCode) => {
    if (!provinceCode) {
      districts.value = []
      wards.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await provinceService.getDistricts(provinceCode)

      console.log('GET DISTRICTS:', response.data)

      districts.value = response.data?.result || response.data || []
    } catch (err) {
      error.value = err
      districts.value = []

      console.error('FETCH DISTRICTS ERROR:', err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchWards = async (districtCode) => {
    if (!districtCode) {
      wards.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await provinceService.getWards(districtCode)

      console.log('GET WARDS:', response.data)

      wards.value = response.data?.result || response.data || []
    } catch (err) {
      error.value = err
      wards.value = []

      console.error('FETCH WARDS ERROR:', err)

      throw err
    } finally {
      loading.value = false
    }
  }

  const clearDistricts = () => {
    districts.value = []
  }

  const clearWards = () => {
    wards.value = []
  }

  const clear = () => {
    provinces.value = []
    districts.value = []
    wards.value = []
    error.value = null
  }

  return {
    provinces,
    districts,
    wards,

    loading,
    error,

    fetchProvinces,
    fetchDistricts,
    fetchWards,

    clearDistricts,
    clearWards,
    clear,
  }
})
