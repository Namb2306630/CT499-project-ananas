// danh mục
// Quần áo
//   ├─ Áo thun
//   ├─ Áo sơ mi

// Giày dép
//   ├─ Giày thể thao
//   ├─ Dép

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    // Tên danh mục (Quần áo, Giày dép)

    slug: String,
    // URL SEO cho đường dẫn đẹp VD ao-thun-nam
    //npm install slugify

    image: {
      type: String,
      default: null,
    },
    // Ảnh đại diện danh mục

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    // Danh mục cha (nếu có)

    // type: {
    //   type: String,
    //   enum: ["featured", "product_line", "style", "accessory", "collection"],
    //   default: "product_line",
    // },

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
