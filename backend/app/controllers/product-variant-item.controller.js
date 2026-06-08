const service = require("../services/product-variant-item.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);

    return ApiResponse.success({
      res,
      data: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSizesByVariant = async (req, res, next) => {
  try {
    const data = await service.getSizesByVariant(req.params.id);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSize = async (req, res, next) => {
  try {
    const data = await service.getSize(req.params.size);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.purchase = async (req, res, next) => {
  try {
    const data = await service.purchase(req.params.id, req.body.quantity);

    return ApiResponse.success({
      res,
      data,
      message: "Mua sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.restoreStock = async (req, res, next) => {
  try {
    const data = await service.restoreStock(req.params.id, req.body.quantity);

    return ApiResponse.success({
      res,
      data,
      message: "Hủy đơn hàng thành công",
    });
  } catch (err) {
    next(err);
  }
};
