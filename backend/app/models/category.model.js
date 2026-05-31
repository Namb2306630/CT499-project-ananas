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
    // URL SEO

    image: String,
    // Ảnh đại diện danh mục

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    // Danh mục cha (nếu có)

    isActive: Boolean,
    // Trạng thái hiển thị
  },
  { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
