const orderService = require("../services/order.service");
const { createOrder, updateOrder } = require("../validations/order.validation");
const ApiResponse = require("../constants/api-response");

class OrderController {
  async create(req, res, next) {
    try {
      const data = await orderService.create(req.body, req.user._id);

      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await orderService.findAll();

      if (data.length === 0) {
        return ApiResponse.success({
          res,
          data: [],
          message: "Không có đơn hàng nào",
        });
      }
      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await orderService.findById(req.params.id);

      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getByUser(req, res, next) {
    try {
      const data = await orderService.findByUser(req.user._id);
      if (data.length === 0) {
        return ApiResponse.success({
          res,
          data: [],
          message: "Không có đơn hàng nào",
        });
      }

      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const data = await orderService.update(req.params.id, req.body);

      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async cancelOrder(req, res, next) {
    try {
      await orderService.cancelOrder(req.params.id, req.user._id);

      return ApiResponse.success({
        res,
        data: true,
        message: "Hủy đơn hàng thành công",
      });
    } catch (err) {
      next(err);
    }
  }
  async updateStatus(req, res, next) {
    try {
      const data = await orderService.updateStatus(
        req.params.orderCode,
        req.body.orderStatus,
      );

      return ApiResponse.success({
        res,
        data,
        message: "Cập nhật trạng thái đơn hàng thành công",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
