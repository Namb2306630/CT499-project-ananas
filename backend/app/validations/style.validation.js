const Joi = require("joi");

exports.createStyleSchema = Joi.object({
  name: Joi.string().required().min(2).min(100).messages({
    "string.empty": "Tên kiểu dáng không được bỏ trống",
    "any.required": "Tên kiểu dáng là bắt buộc",
    "string.min": "Tên kiểu dáng phải có ít nhất 2 ký tự",
    "string.max": "Tên kiểu dáng không được vượt quá 100 ký tự",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
});

exports.updateStyleSchema = Joi.object({
  name: Joi.string().min(2).min(100).messages({
    "string.empty": "Tên kiểu dáng không được bỏ trống",
    "string.min": "Tên kiểu dáng phải có ít nhất 2 ký tự",
    "string.max": "Tên kiểu dáng không được vượt quá 100 ký tự",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
}).min(1);
