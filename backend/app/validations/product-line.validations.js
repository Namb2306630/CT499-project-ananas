const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createProductLineSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên dòng sản phẩm không được để trống",
    "any.required": "Tên dòng sản phẩm là bắt buộc",
    "string.min": "Tên dòng sản phẩm phải có ít nhất 2 ký tự",
    "string.max": "Tên dòng sản phẩm không được vượt quá 100 ký tự",
  }),

  brand: Joi.string().required().messages({
    "string.empty": "Thương hiệu không được để trống",
    "any.required": "Thương hiệu là bắt buộc",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
});
exports.updateProductLineSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.empty": "Tên dòng sản phẩm không được để trống",
    "string.min": "Tên dòng sản phẩm phải có ít nhất 2 ký tự",
    "string.max": "Tên dòng sản phẩm không được vượt quá 100 ký tự",
  }),

  brand: Joi.string().regex(REGEX._ID).messages({
    "string.pattern.base": "Thương hiệu không hợp lệ",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
}).min(0);
