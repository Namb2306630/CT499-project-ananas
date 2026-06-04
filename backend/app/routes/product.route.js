const express = require("express");
const productController = require("../controllers/product.controller");
const { createProductSchema } = require("../validations/product.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createProductSchema),
  productController.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productController.update,
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productController.remove,
);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productController.getAllForAdmin,
);
router.get("/:slug", productController.getBySlug);
router.get("/", productController.getAllForUser);

module.exports = router;
