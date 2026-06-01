const brandService = require("../services/brand.service");
const ApiResponse = require("../constants/api-response");

const { deleteImage } = require("../utils/uploadImage.util");

exports.create = async (req, res, next) => {
  try {
    const data = await brandService.create({
      ...req.body,
      logo: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });
    return ApiResponse.success({
      res,
      data,
      message: "Thêm thương hiệu sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const brandId = req.params.id;

    const brand = await brandService.getById(brandId);
    if (!brand) throw new Error("Brand not found");

    // nếu có file mới
    if (req.file) {
      deleteImage(brand.logo);
      req.body.logo = req.file.path;
    }

    const data = await brandService.update(brandId, req.body);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật thông tin thương hiệu sản phẩm thành công",
    });
  } catch (err) {
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

exports.getAll = async (req, res, next) => {
  try {
    const data = await brandService.getAll();

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
