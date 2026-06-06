const brandService = require("../services/brand.service");
const ApiResponse = require("../constants/api-response");
const { removeUploadedFiles } = require("../utils/uploadImage.util");
exports.create = async (req, res, next) => {
  try {
    console.log(req.file);
    console.log(req.body);
    const data = await brandService.create(req.body, req.file);
    return ApiResponse.success({
      res,
      data,
      message: "Thêm thương hiệu sản phẩm thành công",
    });
  } catch (err) {
    removeUploadedFiles(req.file);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const brandId = req.params.id;

    const data = await brandService.update(brandId, req.body, req.file);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật thông tin thương hiệu sản phẩm thành công",
    });
  } catch (err) {
    removeUploadedFiles(req.file);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const data = await brandService.delete(brandId);

    return ApiResponse.success({
      res,
      data,
      message: "Xóa thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const data = await brandService.getAllForAdmin();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có thương hiệu nào",
      });
    }

    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForUser = async (req, res, next) => {
  try {
    const data = await brandService.getAllForUser();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có thương hiệu nào",
      });
    }

    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const brandId = req.params.id;
    const data = await brandService.getById(brandId);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy thông tin thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};
