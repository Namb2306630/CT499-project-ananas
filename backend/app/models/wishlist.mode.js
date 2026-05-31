const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Chủ wishlist

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        // Sản phẩm yêu thích

        productColor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductColor",
        },
        // màu yêu thích

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
