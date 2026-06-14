const orderItemService = require("../services/order-item.service");

const ApiResponse = require("../constants/api-response");

class OrderItemController {
  async getAll(req, res, next) {
    try {
      const data = await orderItemService.findAll();

      if (data.length === 0) {
        return ApiResponse.success({
          res,
          data: [],
          message: "Không có sản phẩm nào trong đơn hàng",
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

  async getByOrder(req, res, next) {
    try {
      const data = await orderItemService.findByOrder(req.params.orderId);

      return ApiResponse.success({
        res,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderItemController();
