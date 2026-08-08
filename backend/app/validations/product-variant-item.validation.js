const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createProductVItem = Joi.object({
  variant: Joi.string().required().messages({
    "any.required": "Biến thể sản phẩm là bắt buộc",
    "string.empty": "Biến thể sản phẩm là bắt buộc",
  }),

  sizes: Joi.array().items(
    Joi.object({
      size: Joi.string().required().pattern(REGEX.SIZE).messages({
        "any.required": "Size sản phẩm là bắt buộc",
        "string.empty": "Size sản phẩm là bắt buộc",
        "string.pattern.base": "Size sản phẩm không hợp lệ",
      }),

      stock: Joi.number().required().integer().min(0).max(99999).messages({
        "any.required": "Stock là bắt buộc",
        "number.base": "Stock phải là số",
        "number.min": "Stock không được âm",
        "number.max": "Stock quá lớn",
        "number.integer": "Stock phải là số nguyên",
      }),
    }),
  ),
});

exports.updateProductVItem = Joi.object({
  variant: Joi.string().trim().messages({
    "string.empty": "Mã biến thể sản phẩm không được rỗng",
  }),

  size: Joi.string().trim().regex(REGEX.SIZE).messages({
    "string.empty": "Size sản phẩm không được rỗng",
    "string.pattern.base": "Size sản phẩm không hợp lệ",
  }),

  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock phải là số",
    "number.min": "Stock không được âm",
    "number.integer": "Stock phải là số nguyên",
  }),
}).min(1);

exports.purchaseSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});
