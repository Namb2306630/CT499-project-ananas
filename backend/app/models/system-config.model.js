const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    hotline: {
      type: String,
      trim: true,
      default: "",
    },

    // Mã số thuế của doanh nghiệp.
    taxCode: {
      type: String,
      default: "",
      trim: true,
    },

    // // Tổng thuế suất mặc định (%).
    // vatPercent: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    //   max: 100,
    // },

    // Tỷ lệ thuế GTGT. do người mua đóng
    vatRate: {
      type: Number,
      default: 1,
      min: 0,
      max: 100,
    },

    // // Tỷ lệ thuế TNCN. thếu của cưa h
    // personalIncomeTaxRate: {
    //   type: Number,
    //   default: 0.5,
    //   min: 0,
    //   max: 100,
    // },

    // Chi phí vận hành (%).
    operatingCostPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Lợi nhuận mong muốn (%).
    profitPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Giá trị đơn hàng tối thiểu để được miễn phí vận chuyển.
    freeShippingThreshold: {
      type: Number,
      required: true,
      min: 0,
    },

    // Tiền tệ mặc định của hệ thống.
    currency: {
      type: String,
      enum: ["VND", "USD"],
      default: "VND",
    },

    // Cách hiển thị thuế.
    // included: Giá sản phẩm đã bao gồm thuế.
    // excluded: Thuế sẽ được tính riêng khi thanh toán.
    taxDisplayStrategy: {
      type: String,
      enum: ["included", "excluded"],
      default: "included",
    },

    // Ảnh mặc định của trang 404.
    notFoundImage: {
      type: String,
      default: "/images/404.png",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SystemConfig", systemConfigSchema);
