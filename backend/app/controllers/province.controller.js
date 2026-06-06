const provinceService = require("../services/province.service");

// lấy tỉnh
exports.getProvinces = async (req, res) => {
  try {
    const data = await provinceService.getProvinces();

    res.json(data);
  } catch {

    res.status(500).json({
      message: "Lỗi lấy tỉnh",
    });
  }
};

// lấy huyện
exports.getDistricts = async (req, res) => {
  try {
    const data = await provinceService.getDistricts(req.params.code);

    res.json(data);
  } catch {
    res.status(500).json({
      message: "Lỗi lấy huyện",
    });
  }
};

// lấy xã
exports.getWards = async (req, res) => {
  try {
    const data = await provinceService.getWards(req.params.code);

    res.json(data);
  } catch {
    res.status(500).json({
      message: "Lỗi lấy xã",
    });
  }
};
