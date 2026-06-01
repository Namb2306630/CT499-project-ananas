const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    banner: String,

    description: String,

    startDate: Date,

    endDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Collection", collectionSchema);

// bộ sưu tập sản phẩm theo mùa, sự kiện, chủ đề... mỗi bộ có một banner riêng, mô tả riêng, thời gian hiển thị riêng.
