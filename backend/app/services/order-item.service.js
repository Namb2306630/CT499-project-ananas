const OrderItem = require("../models/order-item.model");

const ErrorCode = require("../constants/errors");

class OrderItemService {
  async findAll() {
    return await OrderItem.find()
      .populate("order")
      .populate("product")
      .populate("variant")
      .populate("variantItem")
      .sort({
        createdAt: -1,
      });
  }

  async findById(id) {
    const orderItem = await OrderItem.findById(id)
      .populate("order")
      .populate("product")
      .populate("variant")
      .populate("variantItem");

    if (!orderItem) {
      throw ErrorCode.ORDER_ITEM_NOT_EXISTS();
    }

    return orderItem;
  }

  async findByOrder(orderId) {
    return await OrderItem.find({
      order: orderId,
    })
      .populate("product")
      .populate("variant")
      .populate("variantItem");
  }
}

module.exports = new OrderItemService();
