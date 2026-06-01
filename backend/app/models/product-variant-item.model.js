const mongoose = require("mongoose");

const productSkuSchema = new mongoose.Schema({
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductVariant",
    required: true,
  },

  size: {
    type: String,
    required: true,
  },

  sku: {
    type: String,
    required: true,
    unique: true,
  },

  stock: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("ProductVariantItem", productSkuSchema);
// mỗi màu có một số lượng riêng
