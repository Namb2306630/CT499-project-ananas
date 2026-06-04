const Joi = require("joi");

exports.createBrandSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên thương hiệu không được để trống",
    "any.required": "Tên thương hiệu là bắt buộc",
  }),
  logo: Joi.string().uri().messages({
    "string.uri": "Logo phải là một URL hợp lệ",
    "string.empty": "Logo không được để trống",
  }),
  description: Joi.string().allow("").optional(),
});
exports.updateBrandSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên thương hiệu không được để trống",
  }),

  logo: Joi.string().uri().allow(null).messages({
    "string.uri": "Logo phải là một URL hợp lệ",
  }),

  description: Joi.string().allow(""),

  isActive: Joi.boolean(),
}).min(1);
