//thương hiệu -> 1 thương hiệu là ananas
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

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Brand", brandSchema);
