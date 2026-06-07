const service = require("../services/product-variant.service");
const ApiResponse = require("../constants/api-response");
const { removeUploadedFiles } = require("../utils/uploadImage.util");

exports.create = async (req, res, next) => {
  try {
    const result = await service.create(req.body, req.files);

    let message = "Tạo biến thể sản phẩm thành công";

    if (result.action === "restored") {
      message = "Khôi phục biến thể sản phẩm thành công";
    }

    return ApiResponse.success({
      res,
      data: result.data,
      message,
    });
  } catch (err) {
    if (req.files) removeUploadedFiles(req.files);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await service.update(id, req.body, req.files);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật biến thể sản phẩm thành công",
    });
  } catch (err) {
    if (req.files) removeUploadedFiles(req.files);
    next(err);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;
    await service.remove(id);

    return ApiResponse.success({
      res,
      data: true,
      message: "Ngừng kinh doanh biến thể sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data,
        message: "Danh sách sản phẩm rỗng",
      });
    }

    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await service.getById(id);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy sản phẩm ngừng king doanh thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.getProductVariants = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const data = await service.getProductVariants(idProduct);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy tất cả sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.updateOutOfStock = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await service.updateOutOfStock(id);

    return ApiResponse.success({
      res,
      data: true,
      message: "Cập nhật sản phẩm tạm hết hàng thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.checkExist = async (req, res, next) => {
  try {
    const { productId, colorCode } = req.query;

    const data = await service.checkExist(productId, colorCode);

    return ApiResponse.success({
      res,
      data,
      message: "Kiểm tra sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductColor = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const colorCode = req.params.colorCode.startsWith("#")
      ? req.params.colorCode.toUpperCase()
      : `#${req.params.colorCode.toUpperCase()}`;
    const data = await service.getProductColor(idProduct, colorCode);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getColors = async (req, res, next) => {
  try {
    const colorCode = req.params.colorCode.startsWith("#")
      ? req.params.colorCode.toUpperCase()
      : `#${req.params.colorCode.toUpperCase()}`;
    const data = await service.getColors(colorCode);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};
