const Joi = require("joi");

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
