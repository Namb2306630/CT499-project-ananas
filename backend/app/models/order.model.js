const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Người đặt hàng

    orderCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    // Mã đơn hàng

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    // Tổng tiền sản phẩm trước giảm giá và phí ship

    productDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Giảm giá từ sản phẩm

    voucherDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Giảm giá từ voucher

    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Phí vận chuyển

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Tổng thanh toán cuối cùng

    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "momo", "vnpay", "banking"],
      lowercase: true,
      trim: true,
    },
    // Phương thức thanh toán

    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "failed"],
      lowercase: true,
      trim: true,
    },
    // Trạng thái thanh toán

    orderStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
      lowercase: true,
      trim: true,
    },
    // Trạng thái đơn hàng
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
