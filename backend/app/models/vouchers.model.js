const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: String,
    // Mã giảm giá

    name: String,
    // Tên chương trình

    type: String,
    // fixed | percent

    value: Number,
    // Giá trị giảm

    minOrderValue: Number,
    // Điều kiện đơn tối thiểu

    maxDiscount: Number,
    // Giới hạn giảm tối đa

    quantity: Number,
    // Tổng số lượng voucher

    usedCount: Number,
    // Đã dùng

    startDate: Date,
    // Ngày bắt đầu

    endDate: Date,
    // Ngày kết thúc

    isActive: Boolean,
    // trạng thái
  },
  { timestamps: true },
);

module.exports = mongoose.model("Voucher", voucherSchema);
