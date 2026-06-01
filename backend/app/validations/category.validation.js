const Joi = require("joi");

exports.createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Tên danh mục là bắt buộc",
  }),
});
