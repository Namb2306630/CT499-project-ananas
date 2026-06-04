const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Người đánh giá

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Sản phẩm

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Đơn hàng đã mua (chống spam)

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // 1 - 5 sao

    comment: {
      type: String,
      default: "",
      trim: true,
    },
    // Nội dung đánh giá

    images: {
      type: [String],
      default: [],
    },
    // Ảnh review

    productColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    // Màu đã mua

    size: {
      type: String,
      default: "",
      trim: true,
    },
    // size đã mua
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
