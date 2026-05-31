//mỗi màu có một biến thể
const mongoose = require("mongoose");

const productColorSchema = new mongoose.Schema(
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

    mainImage: String,
    // Ảnh chính

    images: [String],
    // Ảnh phụ

    sizes: [
      {
        size: String,
        // S, M, L, XL

        stock: Number,
        // Số lượng tồn theo size
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductColor", productColorSchema);
