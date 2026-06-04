const express = require("express");

const styleController = require("../controllers/style.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const role = require("../utils/role.util");

const { createStyleSchema } = require("../validations/style.validation");

const router = express.Router();

/* ================= ADMIN ================= */

router.post(
  "/admin/styles",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createStyleSchema),
  styleController.create,
);

router.put(
  "/admin/styles/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.update,
);

router.delete(
  "/admin/styles/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.remove,
);

router.get(
  "/admin/styles",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.getAllForAdmin,
);

router.get(
  "/admin/styles/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  styleController.getById,
);

/* ================= USER ================= */

router.get("/styles", styleController.getAllForUser);

module.exports = router;
