const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    productLine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductLine",
      required: true,
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    categories: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      default: [],
    }, // 1 sp có thể thuộc nhiều danh mục

    // dòng sản phẩm

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Giá nhập

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Giá bán

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      default: "unisex",
      lowercase: true,
      trim: true,
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // giảm giá phần trăm, dùng để hiển thị trên trang list

    styles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Style",
        },
      ],
      default: [],
    },

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

    // defaultColor: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "ProductVariant",
    //   default: null,
    // },
    // Màu mặc định hiển thị ngoài trang list

    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
      lowercase: true,
      trim: true,
    },
    // active | inactive | discontinued
    // active: đang bán
    // inactive: ẩn
    // discontinued: ngừng kinh doanh

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // Điểm đánh giá trung bình

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Số lượng review
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
