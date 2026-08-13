const express = require("express");
const controller = require("../../controllers/product-variant.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const Role = require("../../utils/role.util");
const validate = require("../../middlewares/validate.middleware");
const {
  uploadProductVariantImage,
} = require("../../middlewares/upload.middleware");
const {
  createProductVariantSchema,
  updateProductVariantSchema,
} = require("../../validations/product-variant.validation");

const router = express.Router();
router.use(authMiddleware);
router.use(roleMiddleware(Role.SUPER_ADMIN));

router.post(
  "/",
  uploadProductVariantImage,
  validate(createProductVariantSchema),
  controller.create,
);
router.put(
  "/:id",
  uploadProductVariantImage,
  validate(updateProductVariantSchema),
  controller.update,
);

router.delete("/:id", controller.remove);
router.get("/:id", controller.getById);
router.get("/", controller.getAll);
router.get("/check/admin", controller.checkExist);

//Lấy tất cả variant của 1 product

module.exports = router;
