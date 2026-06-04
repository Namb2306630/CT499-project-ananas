const Joi = require("joi");
const REGEX = require("../utils/regex.util");

exports.createAddressSchema = Joi.object({
  displayName: Joi.string().required().messages({
    "string.empty": "Tên người nhận không được để trống",
    "any.required": "Tên người nhận là bắt buộc",
  }),

  phone: Joi.string().pattern(REGEX.PHONE).required().messages({
    "string.empty": "Số điện thoại không được để trống",
    "string.pattern.base": "Số điện thoại không hợp lệ",
    "any.required": "Số điện thoại là bắt buộc",
  }),

  province: Joi.string().required().messages({
    "string.empty": "Tỉnh / thành phố không được để trống",
    "any.required": "Tỉnh / thành phố là bắt buộc",
  }),

  district: Joi.string().required().messages({
    "string.empty": "Quận / huyện không được để trống",
    "any.required": "Quận / huyện là bắt buộc",
  }),

  ward: Joi.string().required().messages({
    "string.empty": "Phường / xã không được để trống",
    "any.required": "Phường / xã là bắt buộc",
  }),

  detail: Joi.string().required().messages({
    "string.empty": "Địa chỉ chi tiết không được để trống",
    "any.required": "Địa chỉ chi tiết là bắt buộc",
  }),

  isDefault: Joi.boolean(),
});

exports.updateAddressSchema = Joi.object({
  displayName: Joi.string().messages({
    "string.empty": "Tên người nhận không được để trống",
  }),

  phone: Joi.string().pattern(REGEX.PHONE).messages({
    "string.empty": "Số điện thoại không được để trống",
    "string.pattern.base": "Số điện thoại không hợp lệ",
  }),

  province: Joi.string().messages({
    "string.empty": "Tỉnh / thành phố không được để trống",
  }),

  district: Joi.string().messages({
    "string.empty": "Quận / huyện không được để trống",
  }),

  ward: Joi.string().messages({
    "string.empty": "Phường / xã không được để trống",
  }),

  detail: Joi.string().messages({
    "string.empty": "Địa chỉ chi tiết không được để trống",
  }),

  isDefault: Joi.boolean(),
}).min(1); // -> bắt buộc phải có ít nhất 1 field để update
