// nhà cung cấp mặt hàng
const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema(
  {
    name: String,
    // Tên nhà cung cấp

    phone: String,
    // SĐT

    email: String,
    // Email

    address: String,
    // Địa chỉ

    status: String,
    // active | inactive
  },
  { timestamps: true },
);

module.exports = mongoose.model("Supplier", supplierSchema);
