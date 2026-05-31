const mongoose = require("mongoose");
const receiptSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    // Nhà cung cấp

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Nhân viên tạo phiếu

    totalCost: Number,
    // Tổng tiền nhập

    note: String,
    // ghi chú
  },
  { timestamps: true },
);

module.exports = mongoose.model("GoodsReceipt", receiptSchema);
