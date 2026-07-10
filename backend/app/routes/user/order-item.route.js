const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const {
  createOrderItem,
  updateOrderItem,
} = require("../../validations/order-item.validation");
const authMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

const orderItemController = require("../../controllers/order-item.controller");

router.get("/", authMiddleware, orderItemController.getAll);

router.get("/order/:orderId", authMiddleware, orderItemController.getByOrder);

module.exports = router;
