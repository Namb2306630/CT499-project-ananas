const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Sản phẩm cha

    colorName: {
      type: String,
      required: true,
      trim: true,
    },
    // Tên màu (Đỏ, Xanh)

    colorCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    // Mã màu HEX

    mainImage: {
      type: String,
      default: null,
      trim: true,
      // ảnh hiển thị chính ngoài list
    },

    hoverImage: {
      type: String,
      default: null,
      trim: true,
      // ảnh khi hover chuột
    },

    images: {
      type: [String],
      default: [],
    },
    // gallery chi tiết
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
