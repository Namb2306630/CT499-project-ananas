const Joi = require("joi");

exports.createOrder = Joi.object({
  paymentMethod: Joi.string()
    .valid("cod", "momo", "vnpay", "banking")
    .required(),

  items: Joi.array()
    .items(
      Joi.object({
        variantItem: Joi.string().required(),

        quantity: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});

exports.updateOrder = Joi.object({
  paymentStatus: Joi.string().valid("pending", "paid", "failed").optional(),

  orderStatus: Joi.string()
    .valid("pending", "confirmed", "shipping", "completed", "cancelled")
    .optional(),
});
