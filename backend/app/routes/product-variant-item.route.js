const express = require("express");
const controller = require("../controllers/product-variant-item.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const validate = require("../middlewares/validate.middleware");

const {
  createProductVItem,
  purchaseSchema,
  updateProductVItem,
} = require("../validations/product-variant-item.validation");

const router = express.Router();

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createProductVItem),
  controller.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(updateProductVItem),
  controller.update,
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  controller.remove,
);
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
