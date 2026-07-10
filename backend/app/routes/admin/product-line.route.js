const express = require("express");
const {
  createProductLineSchema,
  updateProductLineSchema,
} = require("../../validations/product-line.validations");
const productLineController = require("../../controllers/product-line.controller");
const validate = require("../../middlewares/validate.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const role = require("../../utils/role.util");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");

// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));
router.post(
  "/",
  validate(createProductLineSchema),
  productLineController.create,
);
router.put(
  "/:id",
  validate(updateProductLineSchema),
  productLineController.update,
);
router.delete(
  "/:id",
  productLineController.remove,
);
router.get(
  "/",
  productLineController.getAllForAdmin,
);
router.get(
  "/:slug",
  productLineController.getBySlug,
);

module.exports = router;
