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
    "string.empty": "Loại sản phẩm là bắt buộc",
    "string.pattern.base": "Mã loại sản phẩm không hợp lệ",
  }),

  productLine: Joi.string().pattern(REGEX._ID).required().messages({
    "any.required": "Dòng sản phẩm là bắt buộc",
    "string.empty": "Dòng sản phẩm là bắt buộc",
    "string.pattern.base": "Mã dòng sản phẩm không hợp lệ",
  }),

  productCollection: Joi.string().pattern(REGEX._ID).required().messages({
    "any.required": "Bộ sưu tập là bắt buộc",
    "string.empty": "Bộ sưu tập là bắt buộc",
    "string.pattern.base": "Mã bộ sưu tập không hợp lệ",
  }),

  style: Joi.string().pattern(REGEX._ID).required().messages({
    "any.required": "Kiểu dáng là bắt buộc",
    "string.empty": "Kiểu dáng là bắt buộc",
    "string.pattern.base": "Mã kiểu dáng không hợp lệ",
  }),

  costPrice: Joi.number().min(0).required().messages({
    "number.base": "Giá nhập phải là số",
    "number.min": "Giá nhập phải lớn hơn hoặc bằng 0",
    "any.required": "Giá nhập là bắt buộc",
  }),

  discountPercent: Joi.number().min(0).max(100).default(0).messages({
    "number.base": "Phần trăm giảm giá phải là số",
    "number.min": "Giảm giá không được nhỏ hơn 0%",
    "number.max": "Giảm giá không được lớn hơn 100%",
  }),

  isBestSeller: Joi.boolean().default(false),

  isNewArrival: Joi.boolean().default(false),

  isSale: Joi.boolean().default(false),

  gender: Joi.string()
    .valid("male", "female", "unisex")
    .required()
    .default("unisex")
    .messages({
      "string.empty": "Giới tính là bắt buộc",
      "any.required": "Giới tính là bắt buộc",
      "any.only": "Giới tính không hợp lệ",
    }),
});

exports.updateProductSchema = Joi.object({
  description: Joi.string().allow(""),

  categories: Joi.array().items(Joi.string().pattern(REGEX._ID)).messages({
    "array.base": "Danh mục phải là mảng",
    "string.pattern.base": "Mã danh mục không hợp lệ",
  }),

  productType: Joi.string().pattern(REGEX._ID).messages({
    "string.pattern.base": "Mã loại sản phẩm không hợp lệ",
  }),

  productLine: Joi.string().pattern(REGEX._ID).messages({
    "string.pattern.base": "Mã dòng sản phẩm không hợp lệ",
  }),

  productCollection: Joi.string().pattern(REGEX._ID).allow(null, "").messages({
    "string.pattern.base": "Mã bộ sưu tập không hợp lệ",
  }),

  style: Joi.string().pattern(REGEX._ID).allow(null, "").messages({
    "string.pattern.base": "Mã kiểu dáng không hợp lệ",
  }),

  defaultVariant: Joi.string().pattern(REGEX._ID).allow(null, "").messages({
    "string.pattern.base": "Mã biến thể mặc định không hợp lệ",
  }),

  costPrice: Joi.number().min(0).messages({
    "number.base": "Giá nhập phải là số",
    "number.min": "Giá nhập phải lớn hơn hoặc bằng 0",
  }),

  discountPercent: Joi.number().min(0).max(100).messages({
    "number.base": "Phần trăm giảm giá phải là số",
    "number.min": "Giảm giá không được nhỏ hơn 0%",
    "number.max": "Giảm giá không được lớn hơn 100%",
  }),

  isBestSeller: Joi.boolean(),

  isNewArrival: Joi.boolean(),

  isSale: Joi.boolean(),

  gender: Joi.string().valid("male", "female", "unisex").messages({
    "any.only": "Giới tính không hợp lệ",
  }),

  status: Joi.string().valid("active", "inactive", "discontinued").messages({
    "any.only": "Trạng thái không hợp lệ",
  }),
}).min(1);
