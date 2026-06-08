const express = require("express");

const styleController = require("../controllers/style.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const role = require("../utils/role.util");

const {
  createStyleSchema,
  updateStyleSchema,
} = require("../validations/style.validation");

const router = express.Router();

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createStyleSchema),
  styleController.create,
);

router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(updateStyleSchema),
  styleController.update,
);

router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.remove,
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.getAllForAdmin,
);

router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.getById,
);

router.get("/", styleController.getAllForUser);
router.get("/:id/products", styleController.getProducts);

module.exports = router;
