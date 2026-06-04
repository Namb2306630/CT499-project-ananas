const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    banner: {
      type: String,
      default: null,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Collection", collectionSchema);

// bộ sưu tập sản phẩm theo mùa, sự kiện, chủ đề...
// mỗi bộ có một banner riêng, mô tả riêng, thời gian hiển thị riêng.
