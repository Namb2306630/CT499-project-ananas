const axios = require("axios");
const config = require("../../app/config");

const BASE_URL = config.app.provinceApiUrl;

// lấy tỉnh
exports.getProvinces = async () => {
  const response = await axios.get(`${BASE_URL}/p/`);

  return response.data;
};

// lấy huyện
exports.getDistricts = async (provinceCode) => {
  const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`);

  return response.data.districts;
};

// lấy xã
exports.getWards = async (districtCode) => {
  const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`);

  return response.data.wards;
};
