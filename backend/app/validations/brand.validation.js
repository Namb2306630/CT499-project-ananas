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
});
