const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Đơn hàng chứa sản phẩm này

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Sản phẩm gốc

    productName: {
      type: String,
      required: true,
      trim: true,
    },
    // Tên sản phẩm tại thời điểm đặt hàng

    colorName: {
      type: String,
      required: true,
      trim: true,
    },
    // Màu sản phẩm

    size: {
      type: String,
      required: true,
      trim: true,
    },
    // Size sản phẩm

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    // Số lượng mua

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Giá của 1 sản phẩm tại lúc đặt

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Tổng tiền item = quantity * unitPrice
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
