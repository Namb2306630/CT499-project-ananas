const categoryService = require("../services/category.service");
const ApiResponse = require("../constants/api-response");
const { removeUploadedFiles } = require("../utils/uploadImage.util");

exports.create = async (req, res, next) => {
  try {
    const result = await categoryService.create(req.body, req.file);

    let message = "";

    if (result.action === "created") {
      message = "Tạo danh mục thành công";
    }

    if (result.action === "restored") {
      message =
        "Danh mục đã tồn tại trước đó, hệ thống đã khôi phục và cập nhật lại";
    }

    return ApiResponse.success({
      res,
      data: result.data,
      message,
    });
  } catch (err) {
    if (req.file) removeUploadedFiles(req.file);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const data = await categoryService.update(categoryId, req.body, req.file);
    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật danh mục thành công",
    });
  } catch (err) {
    removeUploadedFiles(req.file);
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await categoryService.remove(categoryId);
    return ApiResponse.success({
      res,
      data: true,
      message: "Xóa danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForUser = async (req, res, next) => {
  try {
    const data = await categoryService.getAllForUser();
    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có danh mục nào",
      });
    }
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const data = await categoryService.getAllForAdmin();
    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có danh mục nào",
      });
    }
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const data = await categoryService.getBySlug(slug);
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};
