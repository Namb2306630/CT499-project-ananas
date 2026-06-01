//mỗi màu có một biến thể
const mongoose = require("mongoose");

const productVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // Sản phẩm cha
    colorName: String,
    // Tên màu (Đỏ, Xanh)
    colorCode: String,
    // Mã màu HEX
    mainImage: {
      type: String,
      // ảnh hiển thị chính ngoài list
    },
    hoverImage: {
      type: String,
      // ảnh khi hover chuột
    },
    images: [String],
    // gallery chi tiết
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductVariant", productVariantSchema);
