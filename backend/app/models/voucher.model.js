const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    // Mã giảm giá

    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Tên chương trình

    type: {
      type: String,
      required: true,
      enum: ["fixed", "percent"],
      lowercase: true,
      trim: true,
    },
    // fixed | percent

    value: {
      type: Number,
      required: true,
      min: 0,
    },
    // Giá trị giảm

    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Điều kiện đơn tối thiểu

    maxDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Giới hạn giảm tối đa

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    // Tổng số lượng voucher

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Đã dùng

    startDate: {
      type: Date,
      required: true,
    },
    // Ngày bắt đầu

    endDate: {
      type: Date,
      required: true,
    },
    // Ngày kết thúc

    isActive: {
      type: Boolean,
      default: true,
    },
    // trạng thái
  },
  { timestamps: true },
);

module.exports = mongoose.model("Voucher", voucherSchema);
