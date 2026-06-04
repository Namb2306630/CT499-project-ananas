const categoryService = require("../services/category.service");
const ApiResponse = require("../constants/api-response");
const { deleteImage } = require("../utils/uploadImage.util");

exports.create = async (req, res, next) => {
  try {
    const data = await categoryService.create({
      ...req.body,
      image: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });
    return ApiResponse.success({
      res,
      data,
      message: "Tạo danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const data = await categoryService.update(categoryId, req.body);
    if (req.file) {
      deleteImage(data.image);
      data.image = req.file.path.replace(/\\/g, "/");
      // chuyền từ đường dẫn Windows sang đường dẫn URL (thay \ thành /)
    }
    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật danh mục thành công",
    });
  } catch (err) {
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
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const data = await categoryService.getById(categoryId);
    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh mục thành công",
    });
  } catch (err) {
    next(err);
  }
};
