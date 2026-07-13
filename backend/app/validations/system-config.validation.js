const Joi = require("joi");

exports.updateSystemSchema = Joi.object({
  email: Joi.string().trim().email().messages({
    "string.email": "Email không hợp lệ",
  }),

  hotline: Joi.string().trim().max(20).messages({
    "string.max": "Hotline không được vượt quá 20 ký tự",
  }),

  taxCode: Joi.string().trim().max(20).messages({
    "string.max": "Mã số thuế không được vượt quá 20 ký tự",
  }),

  // vatPercent: Joi.number().min(0).max(100).messages({
  //   "number.base": "Tổng thuế suất phải là số",
  //   "number.min": "Tổng thuế suất không được nhỏ hơn 0",
  //   "number.max": "Tổng thuế suất không được lớn hơn 100",
  // }),

  vatRate: Joi.number().min(0).max(100).messages({
    "number.base": "Thuế GTGT phải là số",
    "number.min": "Thuế GTGT không được nhỏ hơn 0",
    "number.max": "Thuế GTGT không được lớn hơn 100",
  }),

  // personalIncomeTaxRate: Joi.number().min(0).max(100).messages({
  //   "number.base": "Thuế TNCN phải là số",
  //   "number.min": "Thuế TNCN không được nhỏ hơn 0",
  //   "number.max": "Thuế TNCN không được lớn hơn 100",
  // }),

  operatingCostPercent: Joi.number().min(0).max(100).messages({
    "number.base": "Chi phí vận hành phải là số",
    "number.min": "Chi phí vận hành không được nhỏ hơn 0",
    "number.max": "Chi phí vận hành không được lớn hơn 100",
  }),

  profitPercent: Joi.number().min(0).max(100).messages({
    "number.base": "Lợi nhuận mong muốn phải là số",
    "number.min": "Lợi nhuận mong muốn không được nhỏ hơn 0",
    "number.max": "Lợi nhuận mong muốn không được lớn hơn 100",
  }),

  freeShippingThreshold: Joi.number().min(0).messages({
    "number.base": "Ngưỡng miễn phí vận chuyển phải là số",
    "number.min": "Ngưỡng miễn phí vận chuyển không được nhỏ hơn 0",
  }),

  currency: Joi.string().valid("VND", "USD").messages({
    "any.only": "Tiền tệ chỉ được là VND hoặc USD",
  }),

  taxDisplayStrategy: Joi.string().valid("included", "excluded").messages({
    "any.only": "Chiến lược hiển thị thuế chỉ được là included hoặc excluded",
  }),
}).min(1);
