//cấu hình hệ thồng
const mongoose = require("mongoose");
const systemConfigSchema = new mongoose.Schema(
  {
    vatPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // Thuế VAT
    //trong đó tỷ lệ tính thuế GTGT là 1% và tỷ lệ tính thuế TNCN là 0,5%

    operatingCostPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // Chi phí vận hành

    profitPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    // Lợi nhuận mong muốn

    freeShippingThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    // Miễn phí ship từ bao nhiêu tiền
  },
  { timestamps: true },
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
