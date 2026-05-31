//thương hiệu
const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    name: String,
    // Tên thương hiệu

    slug: String,
    // SEO URL

    logo: String,
    // Logo thương hiệu

    description: String,
    // Mô tả

    isActive: Boolean,
    // Trạng thái hoạt động
  },
  { timestamps: true },
);

module.exports = mongoose.model("Brand", brandSchema);
