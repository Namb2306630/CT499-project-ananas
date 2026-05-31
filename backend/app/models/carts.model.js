//giỏ hảng
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Chủ giỏ hàng

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        productColor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductColor",
        },

        size: String,
        // size đã chọn

        quantity: Number,
        // số lượng
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
