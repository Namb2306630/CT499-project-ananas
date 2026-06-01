//sản phẩm chính
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: String,
    // Tên sản phẩm

    slug: String,
    // SEO URL

    description: String,
    // Mô tả sản phẩm

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // Danh mục

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    // Thương hiệu

    productLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductLine",
    },
    //dòng sản phẩm

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
    },
    // Đối tượng sử dụng sản phẩm

    type: {
      type: String,
      enum: ["shoe", "sock", "lace", "accessory"],
    },

    styles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Style",
      },
    ],

    costPrice: Number,
    // Giá nhập

    sellingPrice: Number,
    // Giá bán

    defaultColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    // Màu mặc định hiển thị ngoài trang list

    totalStock: Number,
    // Tổng tồn kho

    stockStatus: String,
    // in_stock | out_of_stock

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
