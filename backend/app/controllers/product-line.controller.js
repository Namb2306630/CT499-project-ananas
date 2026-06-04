const productLineService = require("../services/product-line.service");
const ErrorCode = require("../constants/errors");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const data = await productLineService.create(req.body);
    return ApiResponse.success({
      res,
      data,
      message: "Tạo dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await productLineService.update(id, req.body);
    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const data = await productLineService.getAllForAdmin();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data,
        message: "Không có dòng sản phẩm nào",
      });
    }
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForUser = async (req, res, next) => {
  try {
    const data = await productLineService.getAllForUser();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data,
        message: "Không có dòng sản phẩm nào",
      });
    }
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await productLineService.getById(id);
    return ApiResponse.success({
      res,
      data,
      message: "Lấy dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    await productLineService.delete(id);
    return ApiResponse.success({
      res,
      data: true,
      message: "Xóa dòng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};
