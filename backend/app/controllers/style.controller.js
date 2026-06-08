const styleService = require("../services/style.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const result = await styleService.create(req.body);
    let message = "";

    if (result.acction === "created") {
      message = "Thêm kiểu dáng sản phẩm thành công";
    }
    if (result.action === "restored") {
      message =
        "Kiểu dán sản phẩm đã tồn tại trước đó, hệ thống đã khôi phục và cập nhật lại";
    }
    return ApiResponse.success({
      res,
      data,
      message,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await styleService.update(id, req.body);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật thông tin kiểu dáng sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  const id = req.params.id;
  await styleService.remove(id);

  return ApiResponse.success({
    res,
    data: true,
    message: "Xóa kiểu dáng sản phẩm thành công",
  });
};

exports.getAllForAdmin = async (req, res, next) => {
  const data = await styleService.getAllForAdmin();

  if (data.length === 0) {
    return ApiResponse.success({
      res,
      data: [],
      message: "Không có kiểu dáng sản phẩm nào",
    });
  }
  return ApiResponse.success({
    res,
    data,
    message: "Không có kiểu dáng sản phẩm nào",
  });
};

exports.getAllForUser = async (req, res, next) => {
  const data = await styleService.getAllForUser();

  if (data.length === 0) {
    return ApiResponse.success({
      res,
      data: [],
      message: "Không có kiểu dáng sản phẩm nào",
    });
  }
  return ApiResponse.success({
    res,
    data,
    message: "Không có kiểu dáng sản phẩm nào",
  });
};

exports.getById = async (req, res, next) => {
  const id = req.params.id;
  const data = await styleService.getById(id);

  return ApiResponse.success({
    res,
    data,
    message: "Lấy sản kiểu dáng sản phẩm thành công",
  });
};

exports.getProducts = async (req, res, next) => {
  const idStyle = req.params.id;
  const data = await styleService.getProducts(idStyle);

  if (data.length === 0) {
    return ApiResponse.success({
      res,
      data: [],
      message: "Không tìm thấy sản phẩm thuộc kiểu dáng này!",
    });
  }
  return ApiResponse.success({
    res,
    data,
  });
};
