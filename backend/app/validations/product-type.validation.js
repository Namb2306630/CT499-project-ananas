const Joi = require("joi");

const create = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Tên loại sản phẩm không được để trống",
    "any.required": "Tên loại sản phẩm là bắt buộc",
  }),

  description: Joi.string().allow("").optional(),
  isActive: Joi.boolean().optional(),
});

const update = Joi.object({
  name: Joi.string().trim(),
  description: Joi.string().allow(""),
  slug: Joi.string().optional(),
  isActive: Joi.boolean(),
});

module.exports = {
  create,
  update,
};
