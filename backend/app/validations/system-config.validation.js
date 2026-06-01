const Joi = require("joi");

const percent = Joi.number().min(0).max(100).required();

exports.updateSystemSchema = Joi.object({
  vatPercent: percent.messages({
    "number.base": "VAT phải là số",
    "number.min": "VAT không được nhỏ hơn 0",
    "number.max": "VAT không được lớn hơn 100",
    "any.required": "VAT là bắt buộc",
  }),

  operatingCostPercent: percent.messages({
    "number.base": "Chi phí vận hành phải là số",
    "number.min": "Chi phí không được nhỏ hơn 0",
    "number.max": "Chi phí không được lớn hơn 100",
    "any.required": "Chi phí là bắt buộc",
  }),

  profitPercent: percent.messages({
    "number.base": "Lợi nhuận phải là số",
    "number.min": "Không được < 0",
    "number.max": "Không được > 100",
    "any.required": "Lợi nhuận là bắt buộc",
  }),

  freeShippingThreshold: Joi.number().min(0).required().messages({
    "number.base": "Ngưỡng free ship phải là số",
    "number.min": "Không được nhỏ hơn 0",
    "any.required": "Ngưỡng free ship là bắt buộc",
  }),
});
