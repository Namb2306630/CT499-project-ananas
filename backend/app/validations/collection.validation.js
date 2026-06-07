const Joi = require("joi");

exports.createCollectionSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Tên dòng sản phẩm không được để trống",
    "any.required": "Tên dòng sản phẩm là bắt buộc",
  }),

  description: Joi.string().allow("").optional(),

  isActive: Joi.boolean().default(true),
  isDeleted: Joi.boolean().default(false),
});

exports.updateCollectionSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Tên bộ sưu tập không được để trống",
  }),

  description: Joi.string().allow(""),

  sellingPrice: Joi.number().min(0),

  isDeleted: Joi.boolean(),
  isActive: Joi.boolean(),
}).min(1);
