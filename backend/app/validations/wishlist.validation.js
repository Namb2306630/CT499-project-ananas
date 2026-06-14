const Joi = require("joi");

exports.createWishlist = Joi.object({
  productVariantItem: Joi.string().trim().required().messages({
    "string.base": "Mã sản phẩm phải là chuỗi",
    "string.empty": "Mã sản phẩm không được để trống",
    "any.required": "Mã sản phẩm là bắt buộc",
  }),

  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải lớn hơn 0",
  }),
});

exports.updateWishlist = Joi.object({
  // productVariantItem: Joi.string().trim().required().messages({
  //   "string.base": "ProductVariantItem phải là chuỗi",
  //   "string.empty": "ProductVariantItem không được để trống",
  //   "any.required": "ProductVariantItem là bắt buộc",
  // }),

  quantity: Joi.number().integer().min(1).messages({
    "number.base": "Số lượng phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng phải lớn hơn 0",
  }),
}).min(0);

exports.moveToCart = Joi.object({
  productVariantItem: Joi.string().trim().required().messages({
    "string.base": "Mã sản phẩm phải là chuỗi",
    "string.empty": "Mã sản phẩm không được để trống",
    "any.required": "Mã sản phẩm là bắt buộc",
  }),
});
