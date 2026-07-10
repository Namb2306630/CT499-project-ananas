const brandService = require("../services/brand.service");
const ApiResponse = require("../constants/api-response");
const { removeUploadedFiles } = require("../utils/uploadImage.util");
exports.create = async (req, res, next) => {
  try {
    const result = await brandService.create(req.body, req.file);

    let message = "";

    if (result.action === "created") {
      message = "Thêm thương hiệu sản phẩm thành công";
    }

    if (result.action === "restored") {
      message =
        "Thương hiệu đã tồn tại trước đó, hệ thống đã khôi phục và cập nhật lại";
    }

    return ApiResponse.success({
      res,
      data: result.data,
      message,
    });
  } catch (err) {
    if (req.file) {
      removeUploadedFiles(req.file);
    }
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
    await brandService.delete(brandId);

    return ApiResponse.success({
      res,
      data: true,
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

exports.getBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const data = await brandService.getBySlug(slug);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy thông tin thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getByBrand = async (req, res, next) => {
  try {
    const id = req.params.brandId;
    const data = await brandService.getByBrand(id);
    return ApiResponse.success({
      res,
      data,
      message: "Lấy các dòng sản phẩn của một thương hiệu thành công",
    });
  } catch (err) {
    next(err);
  }
};
