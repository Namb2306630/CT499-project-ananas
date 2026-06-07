const express = require("express");
const controller = require("../controllers/product-variant.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const validate = require("../middlewares/validate.middleware");
const {
  uploadProductVariantImage,
} = require("../middlewares/upload.middleware");
const {
  createProductVariantSchema,
  updateProductVariantSchema,
} = require("../validations/product-variant.validation");

const router = express.Router();

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadProductVariantImage,
  validate(createProductVariantSchema),
  controller.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadProductVariantImage,
  validate(updateProductVariantSchema),
  controller.update,
);

router.patch("/:id", controller.updateOutOfStock);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  controller.remove,
);

router.get("/:id", controller.getById);
router.get("/", controller.getAll);

router.get("/check/admin", controller.checkExist);
router.get("/:id/:colorCode", controller.getProductColor);
router.get("/:colorCode", controller.getColors);
//Lấy tất cả variant của 1 product

module.exports = router;
