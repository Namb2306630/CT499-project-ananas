const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createProductSchema = Joi.object({
  description: Joi.string().allow("").optional(),

  categories: Joi.array()
    .items(Joi.string().pattern(REGEX._ID))
    .min(1)
    .required()
    .messages({
      "any.required": "Chọn danh mục cho sản phẩm là bắt buộc",
      "array.base": "Danh mục phải là mảng",
      "array.min": "Phải chọn ít nhất một danh mục",
      "string.pattern.base": "Mã danh mục không hợp lệ",
    }),

  productType: Joi.string().pattern(REGEX._ID).required().messages({
    "any.required": "Loại sản phẩm là bắt buộc",
    "string.pattern.base": "Mã loại sản phẩm không hợp lệ",
  }),

  productLine: Joi.string().pattern(REGEX._ID).required().messages({
    "any.required": "Dòng sản phẩm là bắt buộc",
    "string.pattern.base": "Mã dòng sản phẩm không hợp lệ",
  }),

  productCollection: Joi.string()
    .pattern(REGEX._ID)
    .allow(null, "")
    .optional()
    .messages({
      "string.pattern.base": "Mã bộ sưu tập không hợp lệ",
    }),

  style: Joi.string().pattern(REGEX._ID).allow(null, "").optional().messages({
    "string.pattern.base": "Mã kiểu dáng không hợp lệ",
  }),

  costPrice: Joi.number().min(0).required().messages({
    "number.base": "Giá nhập phải là số",
    "any.required": "Giá nhập là bắt buộc",
  }),

  discountPercent: Joi.number().min(0).max(100).default(0),

  isBestSeller: Joi.boolean().default(false),

  isNewArrival: Joi.boolean().default(false),

  isSale: Joi.boolean().default(false),

  gender: Joi.string().valid("male", "female", "unisex").default("unisex"),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên sản phẩm không được để trống",
  }),
  slug: Joi.string().optional(),

  description: Joi.string().allow(""),

  categories: Joi.array().items(Joi.string().regex(REGEX._ID)).messages({
    "array.base": "Danh mục phải là mảng",
  }),

  styles: Joi.string().regex(REGEX._ID).messages({
    "string.pattern.base": "Mã styles không hợp lệ",
  }),

  productLine: Joi.string().regex(REGEX._ID).messages({
    "string.pattern.base": "Mã product line không hợp lệ",
  }),

  defaultVariant: Joi.string().allow(""),

  costPrice: Joi.number().min(0).messages({
    "number.base": "Giá nhập phải là số",
  }),

  discountPercent: Joi.number().min(0).max(100),

  sellingPrice: Joi.number().min(0),

  isBestSeller: Joi.boolean(),
  isNewArrival: Joi.boolean(),
  isSale: Joi.boolean(),

  gender: Joi.string().valid("male", "female", "unisex"),

  status: Joi.string().valid("active", "inactive", "discontinued"),
}).min(1);
