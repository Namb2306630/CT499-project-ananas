//sản phẩm chính
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    productLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductLine",
    },
    //dòng sản phẩm
    costPrice: Number,
    // Giá nhập
    sellingPrice: Number,
    // Giá bán
    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },

    discountPercent: {
      type: Number,
      default: 0,
    },
    //giảm giá phần trăm, dùng để hiển thị trên trang list

    styles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Style",
      },
    ],
    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isSale: {
      type: Boolean,
      default: false,
    },
    defaultColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    // Màu mặc định hiển thị ngoài trang list

    status: String,
    // active | inactive | discontinued
    // active: đang bán
    // inactive: ẩn
    // discontinued: ngừng kinh doanh

    ratingAverage: Number,
    // Điểm đánh giá trung bình

    ratingCount: Number,
    // Số lượng review
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
