const ProductTypeService = require("../services/product-type.service");
const ApiResponse = require("../constants/api-response");
class ProductTypeController {
  async create(req, res, next) {
    try {
      const result = await ProductTypeService.create(req.body);

      let message = "";

      if (result.action === "created") {
        message = "Thêm loại sản phẩm thành công";
      }

      if (result.action === "restored") {
        message =
          "Loại sản phẩm đã tồn tại trước đó, hệ thống đã khôi phục và cập nhật lại";
      }

      return ApiResponse.success({
        res,
        data: result.data,
        message,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = await ProductTypeService.update(req.params.id, req.body);

      return ApiResponse.success({
        res,
        data,
        message: "Cập nhật loại sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await ProductTypeService.remove(req.params.id);

      return ApiResponse.success({
        res,
        data: true,
        message: "Xóa loại sản phẩm thành công",
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdmin(req, res, next) {
    try {
      const data = await ProductTypeService.getAllForAdmin();

      if (data.length === 0) {
        return ApiResponse.success({
          res,
          data: [],
          message: "Danh sách loại sản phẩm rỗng",
        });
      }
      return ApiResponse.success({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const data = await ProductTypeService.getAllForUser();
      if (data.length === 0) {
        return ApiResponse.success({
          res,
          data: [],
          message: "Danh sách loại sản phẩm rỗng",
        });
      }
      return ApiResponse.success({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const data = await ProductTypeService.getBySlug(req.params.slug);

      return ApiResponse.success({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOptions(req, res, next) {
    try {
      const data = await ProductTypeService.getOptions();
      return ApiResponse.success({
        res,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductTypeController();
