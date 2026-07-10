const Joi = require("joi");

exports.createStyleSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên kiểu dáng không được bỏ trống",
    "any.required": "Tên kiểu dáng là bắt buộc",
  }),

  description: Joi.string().allow("").optional(),
});

exports.updateStyleSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên kiểu dáng không được bỏ trống",
  }),

  description: Joi.string().allow(""),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
}).min(1);
