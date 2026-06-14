const Joi = require("joi");

exports.createVoucher = Joi.object({
  code: Joi.string().trim().uppercase().required().messages({
    "string.base": "Mã voucher phải là chuỗi",
    "string.empty": "Vui lòng nhập mã voucher",
    "any.required": "Mã voucher là bắt buộc",
  }),

  name: Joi.string().trim().required().messages({
    "string.base": "Tên voucher phải là chuỗi",
    "string.empty": "Vui lòng nhập tên voucher",
    "any.required": "Tên voucher là bắt buộc",
  }),

  type: Joi.string().valid("fixed", "percent").required().messages({
    "any.only": "Loại voucher chỉ gồm fixed hoặc percent",
    "string.empty": "Vui lòng chọn loại voucher",
    "any.required": "Loại voucher là bắt buộc",
  }),

  value: Joi.number().min(0).required().messages({
    "number.base": "Giá trị giảm phải là số",
    "number.min": "Giảm giá phải lớn hơn hoặc bằng 0",
    "any.required": "Giá trị giảm là bắt buộc",
  }),

  minOrderValue: Joi.number().min(0).default(0).messages({
    "number.base": "Giá trị đơn tối thiểu phải là số",
    "number.min": "Giá trị đơn tối thiểu không hợp lệ",
  }),

  maxDiscount: Joi.number().min(0).default(0).messages({
    "number.base": "Giảm tối đa phải là số",
    "number.min": "Giảm tối đa không hợp lệ",
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Số lượng voucher phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng không được âm",
    "any.required": "Số lượng voucher là bắt buộc",
  }),

  startDate: Joi.date().required().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
    "any.required": "Ngày bắt đầu là bắt buộc",
  }),

  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.base": "Ngày kết thúc không hợp lệ",
    "date.greater": "Ngày kết thúc phải lớn hơn ngày bắt đầu",
    "any.required": "Ngày kết thúc là bắt buộc",
  }),

  isActive: Joi.boolean().default(true),
});

exports.updateVoucher = Joi.object({
  code: Joi.string().trim().uppercase().messages({
    "string.base": "Mã voucher phải là chuỗi",
    "string.empty": "Mã voucher không được để trống",
  }),

  name: Joi.string().trim().messages({
    "string.base": "Tên voucher phải là chuỗi",
    "string.empty": "Tên voucher không được để trống",
  }),

  type: Joi.string().valid("fixed", "percent").messages({
    "any.only": "Loại voucher chỉ gồm fixed hoặc percent",
  }),

  value: Joi.number().min(0).messages({
    "number.base": "Giá trị giảm phải là số",
    "number.min": "Giảm giá phải lớn hơn hoặc bằng 0",
  }),

  minOrderValue: Joi.number().min(0).messages({
    "number.base": "Giá trị đơn tối thiểu phải là số",
    "number.min": "Giá trị đơn tối thiểu không hợp lệ",
  }),

  maxDiscount: Joi.number().min(0).messages({
    "number.base": "Giảm tối đa phải là số",
    "number.min": "Giảm tối đa không hợp lệ",
  }),

  quantity: Joi.number().integer().min(0).messages({
    "number.base": "Số lượng voucher phải là số",
    "number.integer": "Số lượng phải là số nguyên",
    "number.min": "Số lượng không được âm",
  }),

  usedCount: Joi.number().integer().min(0).messages({
    "number.base": "Số lượng đã dùng phải là số",
    "number.integer": "Số lượng đã dùng phải là số nguyên",
    "number.min": "Số lượng đã dùng không được âm",
  }),

  startDate: Joi.date().messages({
    "date.base": "Ngày bắt đầu không hợp lệ",
  }),

  endDate: Joi.date().messages({
    "date.base": "Ngày kết thúc không hợp lệ",
  }),

  isActive: Joi.boolean(),
});
