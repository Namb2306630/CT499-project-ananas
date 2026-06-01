const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // Tên style: streetwear, sport...

    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // SEO URL

    description: {
      type: String,
    },
    // Mô tả style

    isActive: {
      type: Boolean,
      default: true,
    },
    // Trạng thái sử dụng
  },
  { timestamps: true },
);

module.exports = mongoose.model("Style", styleSchema);
