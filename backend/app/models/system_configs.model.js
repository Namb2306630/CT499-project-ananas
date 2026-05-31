//cấu hình hệ thồng
const mongoose = require("mongoose");
const systemConfigSchema = new mongoose.Schema(
  {
    vatPercent: Number,
    // Thuế VAT

    operatingCostPercent: Number,
    // Chi phí vận hành

    profitPercent: Number,
    // Lợi nhuận mong muốn

    freeShippingThreshold: Number,
    // Miễn phí ship từ bao nhiêu tiền
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
