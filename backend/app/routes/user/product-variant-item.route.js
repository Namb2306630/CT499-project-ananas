const express = require("express");
const controller = require("../../controllers/product-variant-item.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");

const {
  createProductVItem,
  purchaseSchema,
  updateProductVItem,
} = require("../../validations/product-variant-item.validation");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/variant/:id", controller.getSizesByVariant);
router.get("/size/:size", controller.getSize);
router.patch(
  "/purchase/:id",
  authMiddleware,
  validate(purchaseSchema),
  controller.purchase,
);

//test api này
router.patch(
  "/restore/:id",
  authMiddleware,
  validate(purchaseSchema),
  controller.restoreStock,
);
router.get("/:id", controller.getById);
module.exports = router;
