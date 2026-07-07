const Joi = require("joi");

exports.createBrandSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên thương hiệu không được để trống",
    "any.required": "Tên thương hiệu là bắt buộc",
  }),
  logo: Joi.any().optional(),
  description: Joi.string().allow("").optional(),
});
exports.updateBrandSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên thương hiệu không được để trống",
  }),

  description: Joi.string().allow(""),

  isActive: Joi.boolean(),
}).min(0);
