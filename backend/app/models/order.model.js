const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Người đặt

    orderCode: String,
    // Mã đơn hàng

    addressSnapshot: {
      displayName: String,
      phone: String,
      province: String,
      district: String,
      ward: String,
      detail: String,
    },
    // Snapshot địa chỉ giao hàng

    items: [
      {
        product: mongoose.Schema.Types.ObjectId,
        productName: String,
        colorName: String,
        size: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    // Danh sách sản phẩm trong đơn

    subtotal: Number,
    // Tổng tiền hàng

    productDiscount: Number,
    // Giảm giá sản phẩm

    voucherDiscount: Number,
    // Giảm giá voucher

    shippingFee: Number,
    // Phí ship

    totalAmount: Number,
    // Tổng thanh toán

    paymentMethod: String,
    // cod | momo | vnpay | banking

    paymentStatus: String,
    // pending | paid | failed

    orderStatus: String,
    // pending | confirmed | shipping | completed | cancelled
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
