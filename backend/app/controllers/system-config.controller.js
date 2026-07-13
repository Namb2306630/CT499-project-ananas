const systemConfigService = require("../services/system-config.service");
const ApiResponse = require("../constants/api-response");

exports.get = async (req, res, next) => {
  try {
    const data = await systemConfigService.get();
    console.log(data.notFoundImage);
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
    const data = await systemConfigService.update(req.body);
    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật dữ liệu cho cấu hình hệ thống thành công!",
    });
  } catch (err) {
    next(err);
  }
};
exports.updateNotFoundImage = async (req, res, next) => {
  try {
    const data = await systemConfigService.updateNotFoundImage(req.file);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật ảnh 404 thành công",
    });
  } catch (err) {
    next(err);
  }
};
