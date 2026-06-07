const service = require("../services/collection.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const result = await service.create(req.body);

    let message = "";

    if (result.action === "created") {
      message = "Thêm dòng sản phẩm thành công";
    }

    if (result.action === "restored") {
      message =
        "Dòng sản phẩm đã tồn tại trước đó, hệ thống đã khôi phục và cập nhật lại";
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
    const data = await service.update(id, req.body);
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
    const id = req.params.id;
    await service.remove(id);
    return ApiResponse.success({
      res,
      data: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const data = await service.getAllForAdmin();
    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có dòng sản phẩm nào!",
      });
    }
    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForUser = async (req, res, next) => {
  try {
    const data = await service.getAllForUser();
    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có dòng sản phẩm nào!",
      });
    }
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
    const id = req.params.id;
    const data = await service.getById(id);
    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};
exports.getProducts = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await service.getProducts(id);
    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có sản phẩm nào thuộc bộ sưu tập này",
      });
    }
    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};
