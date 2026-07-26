const Joi = require("joi");
const REGEX = require("../utils/regex.util");

const createProductVariantSchema = Joi.object({
  _id: Joi.string().trim().required().min(7).max(7).messages({
    "string.base": "Mã sản phẩm phải là string",
    "string.empty": "Mã sản phẩm không được rỗng",
    "any.required": "Mã sản phẩm là bắt buộc",
    "string.min": "Mã sản phẩm phải có ít nhất 7 ký tự",
    "string.max": "Mã sản phẩm không được vượt quá 7 ký tự",
  }),
  product: Joi.string().trim().required().messages({
    "string.base": "Sản phẩm không hợp lệ",
    "string.empty": "Sản phẩm không được để trống",
    "any.required": "Sản phẩm là bắt buộc",
  }),

  colorName: Joi.string().trim().required().min(2).max(50).messages({
    "string.base": "Tên màu không hợp lệ",
    "string.empty": "Tên màu không được để trống",
    "any.required": "Tên màu là bắt buộc",
    "string.min": "Tên màu phải có ít nhất 2 ký tự",
    "string.max": "Tên màu không được vượt quá 50 ký tự",
  }),

  colorCode: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^#?[0-9A-F]{6}$/i)
    .required()
    .min(7)
    .max(7)
    .messages({
      "string.base": "Mã màu không hợp lệ",
      "string.empty": "Mã màu không được để trống",
      "string.pattern.base": "Mã màu phải là HEX (VD: #FF0000)",
      "any.required": "Mã màu là bắt buộc",
      "string.min": "Mã màu phải có ít nhất 7 ký tự",
      "string.max": "Mã màu không được vượt quá 7 ký tự",
    }),

  mainImage: Joi.string().trim().required().messages({
    "string.base": "Ảnh chính không hợp lệ",
    "string.empty": "Ảnh chính không được để trống",
    "any.required": "Ảnh chính là bắt buộc",
  }),

  hoverImage: Joi.string().trim().required().messages({
    "string.base": "Ảnh hover không hợp lệ",
    "string.empty": "Ảnh hover không được để trống",
    "any.required": "Ảnh hover là bắt buộc",
  }),

  images: Joi.array().items(Joi.string()).messages({
    "array.base": "Danh sách ảnh không hợp lệ",
  }),
});

const updateProductVariantSchema = Joi.object({
  product: Joi.string().regex(REGEX._ID).messages({
    "string.base": "Product phải là string",
    "string.pattern.base": "Mã Product không hợp lệ",
  }),

  colorName: Joi.string().trim().min(2).max(50).messages({
    "string.base": "Tên màu không hợp lệ",
    "string.min": "Tên màu phải có ít nhất 2 ký tự",
    "string.max": "Tên màu không được vượt quá 50 ký tự",
  }),

  colorCode: Joi.string()
    .trim()
    .uppercase()
    .pattern(/^#?[0-9A-F]{6}$/i)
    .min(7)
    .max(7)
    .messages({
      "string.pattern.base": "Mã màu phải là HEX (vd: #FF0000)",
      "string.min": "Mã màu phải có ít nhất 7 ký tự",
      "string.max": "Mã màu không được vượt quá 7 ký tự",
    }),
  mainImage: Joi.string().trim().messages({
    "string.base": "Ảnh chính không hợp lệ",
    "string.empty": "Ảnh chính không được để trống",
  }),

  hoverImage: Joi.string().trim().messages({
    "string.base": "Ảnh hover không hợp lệ",
    "string.empty": "Ảnh hover không được để trống",
  }),

  images: Joi.alternatives()
    .try(Joi.string(), Joi.array().items(Joi.string()))
    .messages({
      "alternatives.match": "Danh sách ảnh không hợp lệ",
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
