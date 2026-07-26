const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Tên loại sản phẩm không được để trống",
    "any.required": "Tên loại sản phẩm là bắt buộc",
    "string.min": "Tên loại sản phẩm phải có ít nhất 2 ký tự",
    "string.max": "Tên loại sản phẩm không được vượt quá 100 ký tự",
  }),

  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
  isActive: Joi.boolean().optional(),
});

const update = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "Tên loại sản phẩm không được để trống",
    "string.min": "Tên loại sản phẩm phải có ít nhất 2 ký tự",
    "string.max": "Tên loại sản phẩm không được vượt quá 100 ký tự",
  }),
  description: Joi.string().allow("").max(500).optional().messages({
    "string.max": "Mô tả không được vượt quá 500 ký tự",
  }),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
});

module.exports = {
  create,
  update,
};
