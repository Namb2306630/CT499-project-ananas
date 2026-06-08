const mongoose = require("mongoose");

const productVariantItemSchema = new mongoose.Schema(
  {
    variant: {
      type: String,
      ref: "ProductVariant",
      required: true,
      index: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isInStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductVariantItem", productVariantItemSchema);
