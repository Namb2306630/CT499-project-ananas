const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên danh mục không được để trống",
    "any.required": "Tên danh mục là bắt buộc",
  }),
  parent: Joi.string().regex(REGEX._ID).allow(null).optional().messages({
    "string.pattern.base": "Parent không hợp lệ",
  }),
  image: Joi.string().allow("", null).optional(),
});
