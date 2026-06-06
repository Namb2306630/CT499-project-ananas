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

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock", "discontinued"],
      default: "active",
    },
    // active	đang bán bình thường
    // inactive	ẩn khỏi user (admin giữ lại)
    // out_of_stock	hết hàng tạm thời
    // discontinued	ngừng bán vĩnh viễn
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
