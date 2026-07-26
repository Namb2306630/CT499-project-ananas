const Joi = require("joi");

exports.createCollectionSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên bộ sưu tập không được để trống",
    "string.min": "Tên bộ sưu tập phải có ít nhất 2 ký tự",
    "string.max": "Tên bộ sưu tập không được vượt quá 100 ký tự",
    "any.required": "Tên dòng sản phẩm là bắt buộc",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),

  isActive: Joi.boolean().default(true),
  isDeleted: Joi.boolean().default(false),
});

exports.updateCollectionSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.empty": "Tên bộ sưu tập không được để trống",
    "string.min": "Tên bộ sưu tập phải có ít nhất 2 ký tự",
    "string.max": "Tên bộ sưu tập không được vượt quá 100 ký tự",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),

  sellingPrice: Joi.number().min(0),
  slug: Joi.string().optional(),
  isDeleted: Joi.boolean(),
  isActive: Joi.boolean(),
}).min(1);
