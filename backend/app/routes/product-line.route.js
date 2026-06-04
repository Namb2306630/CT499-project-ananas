const express = require("express");
const {
  createProductLineSchema,
} = require("../validations/product-line.validations");
const productLineController = require("../controllers/product-line.controller");
const validate = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
router.post(
  "/admin/product-lines",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createProductLineSchema),
  productLineController.create,
);
router.put(
  "/admin/product-lines/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.update,
);
router.delete(
  "/addmin/product-lines/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.remove,
);
router.get(
  "/admin/product-lines",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.getAllForAdmin,
);
router.get("/product-lines", productLineController.getAllForUser);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.getById,
);

module.exports = router;
