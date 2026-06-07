const express = require("express");
const {
  createProductLineSchema,
  updateProductLineSchema,
} = require("../validations/product-line.validations");
const productLineController = require("../controllers/product-line.controller");
const validate = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createProductLineSchema),
  productLineController.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(updateProductLineSchema),
  productLineController.update,
);
router.delete(
  "/addmin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.remove,
);
router.get("/", productLineController.getAllForUser);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.getAllForAdmin,
);
router.get(
  "admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.getById,
);

router.get("/:id/products", productLineController.getProducts);

module.exports = router;
