//đơn vị vận chuyển

const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema(
  {
    provider: String,
    // Đơn vị vận chuyển

    province: String,
    // Khu vực

    fee: Number,
    // Phí ship

    estimatedDays: Number,
    // Thời gian giao

    isActive: Boolean,
    // trạng thái
  },
  { timestamps: true },
);

module.exports = mongoose.model("ShippingConfig", shippingSchema);
