const mongoose = require("mongoose");
const receiptItemSchema = new mongoose.Schema(
  {
    receipt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoodsReceipt",
    },
    // Phiếu nhập

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // Sản phẩm

    productColor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductColor",
    },
    // Màu

    size: String,
    // size

    quantity: Number,
    // số lượng nhập

    importPrice: Number,
    // giá nhập

    totalPrice: Number,
    // tổng tiền
  },
  { timestamps: true },
);

module.exports = mongoose.model("GoodsReceiptItem", receiptItemSchema);
