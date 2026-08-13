const express = require("express");
const productController = require("../../controllers/product.controller");
const {
  createProductSchema,
  updateProductSchema,
} = require("../../validations/product.validation");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const Role = require("../../utils/role.util");
const validate = require("../../middlewares/validate.middleware");

const router = express.Router();
router.use(authMiddleware);
router.use(roleMiddleware(Role.SUPER_ADMIN));
router.post("/", validate(createProductSchema), productController.create);
router.put("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);
router.get("/", productController.getAllForAdmin);
router.get("/:slug", productController.getBySlug);

module.exports = router;
