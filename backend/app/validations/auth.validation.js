const Joi = require("joi");
const REGEX = require("../utils/regex");

exports.registerSchema = Joi.object({
  phone: Joi.string().pattern(REGEX.PHONE).required().messages({
    "string.empty": "Vui lòng nhập số điện thoại đăng ký",
    "string.pattern.base": "Số điện thoại không hợp lệ",
    "any.required": "Số điện thoại là bắt buộc",
  }),

  password: Joi.string().pattern(REGEX.PASSWORD).required().messages({
    "string.empty": "Vui lòng nhập mật khẩu",
    "string.pattern.base":
      "Mật khẩu ít nhất 8 ký tự gồm chữ hoa, số và ký tự đặc biệt",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu xác nhận không khớp",
    "any.required": "Vui lòng nhập lại mật khẩu",
  }),
});
exports.loginSchema = Joi.object({
  phone: Joi.string().pattern(REGEX.PHONE).required().messages({
    "string.empty": "Vui lòng nhập số điện thoại",
    "string.pattern.base": "Số điện thoại không hợp lệ",
    "any.required": "Số điện thoại là bắt buộc",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Vui lòng nhập mật khẩu",
    "any.required": "Mật khẩu là bắt buộc",
  }),
});
