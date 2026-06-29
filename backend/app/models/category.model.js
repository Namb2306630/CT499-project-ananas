const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Tên danh mục (Quần áo, Giày dép)

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // URL SEO cho đường dẫn đẹp VD ao-thun-nam
    // npm install slugify

    image: {
      type: String,
      default: null,
      trim: true,
    },
    // Ảnh đại diện danh mục
    productCount: {
      type: Number,
      default: 0,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    // Danh mục cha (nếu có)

    isActive: {
      type: Boolean,
      default: true,
    },
    // Trạng thái hiển thị

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
