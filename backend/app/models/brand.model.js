const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Tên thương hiệu

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // SEO URL

    logo: {
      type: String,
      default: null,
      trim: true,
    },
    // Logo thương hiệu

    description: {
      type: String,
      default: "",
      trim: true,
    },
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
