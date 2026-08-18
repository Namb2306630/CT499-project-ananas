const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const {
  createOrder,
  updateOrder,
} = require("../../validations/order.validation");
const router = express.Router();

const orderController = require("../../controllers/order.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/", authMiddleware, validate(createOrder), orderController.create);

router.get("/", authMiddleware, orderController.getAll);
router.get("/user", authMiddleware, orderController.getByUser);
router.get("/:id", authMiddleware, orderController.getById);
router.patch("/cancel/:id", authMiddleware, orderController.cancelOrder);
// router.patch(
//   "/:id",
//   authMiddleware,
//   validate(updateOrder),
//   orderController.update,
// );
router.patch(
  "/:orderCode/status",
  authMiddleware,
  validate(updateOrder),
  orderController.updateStatus,
);

module.exports = router;
