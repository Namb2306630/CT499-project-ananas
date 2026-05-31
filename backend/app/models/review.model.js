const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Người đánh giá

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // Sản phẩm

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    // Đơn hàng đã mua (chống spam)

    rating: Number,
    // 1 - 5 sao

    comment: String,
    // Nội dung đánh giá

    images: [String],
    // Ảnh review

    productColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductColor",
    },
    // Màu đã mua

    size: String,
    // size đã mua
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
