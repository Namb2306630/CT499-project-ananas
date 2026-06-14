const Joi = require("joi");

exports.createCart = Joi.object({
  variantId: Joi.string().required().messages({
    "any.required": "Thiếu biến thể sản phẩm",
  }),

  size: Joi.string().required().messages({
    "any.required": "Vui lòng chọn Size/Số lượng",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "Vui lòng chọn Size/Số lượng",
  }),
});

exports.updateCart = Joi.object({
  quantity: Joi.number().integer().min(1).messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải lớn hơn 0",
  }),
}).min(0);
