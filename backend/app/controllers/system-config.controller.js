const systemConfigService = require("../services/system-config.service");
const ApiResponse = require("../constants/api-response");

exports.get = async (req, res, next) => {
  try {
    const data = await systemConfigService.get();

    return ApiResponse.success({
      res,
      data,
      message: "Lấy thông tin cấu hệ thống thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.update = async (req, res, next) => {
  try {
    const systemId = req.body.systemId;
    const data = await systemConfigService.update(systemId, req.body);
    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật cấu hình hệ thống thành công",
    });
  } catch (err) {
    next(err);
  }
};
