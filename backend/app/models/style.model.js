const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Tên style: streetwear, sport...

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // SEO URL

    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Mô tả style

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Trạng thái sử dụng
  },
  { timestamps: true },
);

module.exports = mongoose.model("Style", styleSchema);
