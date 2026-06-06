const Joi = require("joi");
const REGEX = require("../utils/regex.util");

const createProductVariantSchema = Joi.object({
  product: Joi.string().regex(REGEX._ID).required().messages({
    "string.base": "Product phải là string",
    "any.required": "Product là bắt buộc",
    "string.pattern.base": "Mã Product không hợp lệ",
  }),

  colorName: Joi.string().trim().required().messages({
    "string.base": "Tên màu không hợp lệ",
    "any.required": "Tên màu là bắt buộc",
  }),

  colorCode: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^#?[0-9A-F]{6}$/i)
    .required()
    .messages({
      "string.pattern.base": "Mã màu phải là HEX (vd: #FF0000)",
      "any.required": "Mã màu là bắt buộc",
    }),

  // mainImage: Joi.string().trim().required().messages({
  //   "any.required": "Main image là bắt buộc",
  //   "string.base": "Main image phải là string",
  // }),

  // hoverImage: Joi.string().trim().required().messages({
  //   "any.required": "Hover image là bắt buộc",
  //   "string.base": "Hover image phải là string",
  // }),

  // images: Joi.array().items(Joi.string()).default([]),
});

const updateProductVariantSchema = Joi.object({
  product: Joi.string().regex(REGEX._ID).messages({
    "string.base": "Product phải là string",
    "string.pattern.base": "Mã Product không hợp lệ",
  }),

  colorName: Joi.string().trim().messages({
    "string.base": "Tên màu không hợp lệ",
  }),

  colorCode: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^#?[0-9A-F]{6}$/i)
    .messages({
      "string.pattern.base": "Mã màu phải là HEX (vd: #FF0000)",
    }),

  status: Joi.string()
    .valid("active", "inactive", "out_of_stock", "discontinued")
    .messages({
      "any.only": "Trạng thái không hợp lệ",
    }),
}).min(0); // -> bắt buộc phải có ít nhất 1 field để update

module.exports = {
  createProductVariantSchema,
  updateProductVariantSchema,
};
