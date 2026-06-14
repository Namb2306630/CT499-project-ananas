const Joi = require("joi");

exports.createOrderItem = Joi.object({
  order: Joi.string().required(),

  variantItem: Joi.string().required(),

  quantity: Joi.number().min(1).required(),
});

exports.updateOrderItem = Joi.object({
  quantity: Joi.number().min(1).optional(),
});
