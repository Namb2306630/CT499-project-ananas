// const mongoose = require("mongoose");

// const shippingSchema = new mongoose.Schema(
//   {
//     provider: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Đơn vị vận chuyển

//     province: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Khu vực

//     fee: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     // Phí ship

//     estimatedDays: {
//       type: Number,
//       required: true,
//       min: 1,
//     },
//     // Thời gian giao

//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     // trạng thái
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("ShippingConfig", shippingSchema);
