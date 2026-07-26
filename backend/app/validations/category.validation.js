const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "string.min": "Tên danh mục phải có ít nhất 2 ký tự",
    "string.max": "Tên danh mục không được vượt quá 100 ký tự",
    "any.required": "Tên danh mục là bắt buộc",
  }),
  parent: Joi.string().regex(REGEX._ID).allow(null).optional().messages({
    "string.pattern.base": "Parent không hợp lệ",
  }),
  // image: Joi.string().allow("", null).optional(),
  image: Joi.any(),
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.empty": "Tên danh mục không được để trống",
    "string.min": "Tên danh mục phải ít nhất 2 ký tự",
    "string.max": "Tên danh mục không được vượt quá 100 ký tự",
  }),

  slug: Joi.string().optional(),

  parent: Joi.string().regex(REGEX._ID).allow(null).messages({
    "string.pattern.base": "Parent không hợp lệ",
  }),

  // image: Joi.string().allow(null, ""),

  isActive: Joi.boolean(),
  image: Joi.any(),
}).min(0);
