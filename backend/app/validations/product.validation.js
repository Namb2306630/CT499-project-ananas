const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Tên sản phẩm là bắt buộc",
  }),

  description: Joi.string().allow("").optional(),

  // ===== ARRAY ID =====
  categories: Joi.array()
    .items(Joi.string().regex(REGEX._ID))
    .min(1)
    .required()
    .messages({
      "any.required": "Chọn danh mục cho sản phẩm là bắt buộc",
      "array.base": "Danh mục phải là mảng",
    }),

  styles: Joi.array().items(Joi.string().regex(REGEX._ID)).optional(),

  // ===== SINGLE ID =====
  brand: Joi.string().regex(REGEX._ID).required().messages({
    "any.required": "Thương hiệu là bắt buộc",
    "string.pattern.base": "Mã brand không hợp lệ",
  }),

  productLine: Joi.string().regex(REGEX._ID).required().messages({
    "any.required": "Dòng sản phẩm là bắt buộc",
    "string.pattern.base": "Mã product line không hợp lệ",
  }),

  defaultColor: Joi.string().regex(REGEX._ID).allow(null).optional().messages({
    "string.pattern.base": "Mã màu không hợp lệ",
  }),

  // ===== PRICE =====
  costPrice: Joi.number().min(0).required().messages({
    "number.base": "Giá nhập phải là số",
    "any.required": "Giá nhập là bắt buộc",
  }),

  discountPercent: Joi.number().min(0).max(100).default(0),

  // ===== FLAGS =====
  isBestSeller: Joi.boolean().default(false),
  isNewArrival: Joi.boolean().default(false),
  isSale: Joi.boolean().default(false),

  gender: Joi.string().valid("male", "female", "unisex").default("unisex"),
});
