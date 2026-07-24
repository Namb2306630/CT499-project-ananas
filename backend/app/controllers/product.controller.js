const productService = require("../services/product.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const result = await productService.create(req.body);

    let message = "";

    if (result.action === "created") {
      message = "Tạo sản phẩm thành công";
    }

    if (result.action === "restored") {
      message = "Sản phẩm đã được khôi phục";
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

    const data = await productService.update(id, req.body);

    return ApiResponse.success({
      res,
      data,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = req.params.id;

    await productService.remove(id);

    return ApiResponse.success({
      res,
      data: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const page = req.query.page || 1;

    const data = await productService.getAllForAdmin(page);

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có sản phẩm",
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

exports.getAllForUser = async (req, res, next) => {
  try {
    const data = await productService.getAllForUser();

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có sản phẩm",
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

exports.getBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;

    const data = await productService.getBySlug(slug);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy chi tiết sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const keyword = req.query.keyword || "";

    const data = await productService.search(keyword);

    return ApiResponse.success({
      res,
      data,
      message: "Tìm kiếm sản phẩm thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.getVariants = async (req, res, next) => {
  try {
    const idProduct = req.params.id;
    const data = await productService.getVariants(idProduct);

    if (data.length === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có biến thể sản phẩm nào thuộc sản phẩm này hết",
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

exports.getOptions = async (req, res, next) => {
  try {
    const data = await productService.getOptions();

    return ApiResponse.success({
      res,
      data,
    });
  } catch (error) {
    next(error);
  }
};
