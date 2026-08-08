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

    // isInStock: {
    //   type: Boolean,
    //   default: true,
    // },
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);
//đảm bảo ko trùng dl
productVariantItemSchema.index(
  {
    variant: 1,
    size: 1,
  },
  {
    unique: true,
  },
);
module.exports = mongoose.model("ProductVariantItem", productVariantItemSchema);
