const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createProductLineSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên dòng sản phẩm không được để trống",
    "any.required": "Tên dòng sản phẩm là bắt buộc",
  }),

  brand: Joi.string().required().messages({
    "string.empty": "Brand không được để trống",
    "any.required": "Brand là bắt buộc",
  }),

  description: Joi.string().allow("").optional(),
});
exports.updateProductLineSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên dòng sản phẩm không được để trống",
  }),

  brand: Joi.string().regex(REGEX._ID).messages({
    "string.pattern.base": "Brand không hợp lệ",
  }),

  description: Joi.string().allow(""),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
}).min(0);
