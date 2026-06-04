const Joi = require("joi");

exports.createStyleSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.emptyempty": "Tên kiểu dáng không được bỏ trống",
    "any.required": "Tên kiểu dáng là bắt buộc",
  }),
  description: Joi.string().allow("").optional(),
});
