import api from '@/api/axios'

export default {
  getProvinces() {
    return api.get('/provinces')
  },

  getDistricts(provinceCode) {
    return api.get(`/provinces/${provinceCode}/districts`)
  },

  getWards(districtCode) {
    return api.get(`/provinces/districts/${districtCode}/wards`)
  },
}
