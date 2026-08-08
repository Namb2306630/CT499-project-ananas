const express = require("express");
const controller = require("../../controllers/product-variant-item.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const role = require("../../utils/role.util");
const validate = require("../../middlewares/validate.middleware");

const {
  createProductVItem,
  purchaseSchema,
  updateProductVItem,
} = require("../../validations/product-variant-item.validation");

const router = express.Router();
// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));
router.post("/", validate(createProductVItem), controller.create);
router.put("/:id", validate(updateProductVItem), controller.update);
router.delete("/:id", controller.remove);
router.get("/", controller.getAll);
router.get("/:sku", controller.getBySku);
module.exports = router;
