const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    // Đơn hàng
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    // ===== RELATION =====

    // Product gốc
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Variant màu
    variant: {
      type: String,
      ref: "ProductVariant",
      required: true,
    },

    // Variant item (size)
    variantItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariantItem",
      required: true,
    },

    // ===== SNAPSHOT DATA =====
    // dữ liệu tại thời điểm mua

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    colorName: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    productImage: {
      type: String,
      default: null,
      trim: true,
    },

    // ===== PRICE =====

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    // Giá tại thời điểm mua
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // quantity * unitPrice
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// tối ưu query
orderItemSchema.index({
  order: 1,
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
