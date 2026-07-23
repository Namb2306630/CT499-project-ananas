const productLineService = require("../services/product-line.service");
const ErrorCode = require("../constants/errors");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const result = await productLineService.create(req.body);

    let message = "";

    if (result.action === "created") {
      message = "Tạo dòng sản phẩm thành công";
    }

    if (result.action === "restored") {
      message = "Dòng sản phẩm đã tồn tại trước đó, hệ thống đã khôi phục lại";
    }

    return ApiResponse.success({
      res,
      data: result.data,
      message,
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

exports.getBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const data = await productLineService.getBySlug(slug);
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

exports.getProducts = async (req, res, next) => {
  const idLine = req.params.id;
  const data = await productLineService.getProducts(idLine);

  if (data.length === 0) {
    return ApiResponse.success({
      res,
      data: [],
      message: "Không có sản phẩm nào thuộc dòng sản phẩm này",
    });
  }

  return ApiResponse.success({
    res,
    data,
  });
};
exports.getOptions = async (req, res, next) => {
  try {
    const data = await productLineService.getOptions();
    return ApiResponse.success({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
};
