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
  "/",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createProductLineSchema),
  productLineController.create,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.update,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  productLineController.remove,
);
router.get("/", productLineController.getAll);
router.get("/:id", productLineController.getById);

module.exports = router;
