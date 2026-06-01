const categoryService = require("../services/category.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const data = await categoryService.create(req.body);
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

exports.getAll = async (req, res, next) => {
  try {
    const data = await categoryService.getAll();
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
