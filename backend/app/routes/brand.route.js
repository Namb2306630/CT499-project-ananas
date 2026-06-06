const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const router = express.Router();
const { uploadBrandLogo } = require("../middlewares/upload.middleware");
const {
  createBrandSchema,
  updateBrandSchema,
} = require("../validations/brand.validation");

//router.use(authMiddleware);

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadBrandLogo,
  validate(createBrandSchema), // chỉ nhận 1 file với field name là logo
  brandController.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadBrandLogo,
  validate(updateBrandSchema),
  brandController.update,
);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  brandController.getAllForAdmin,
);
router.get("/", brandController.getAllForUser);
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  brandController.getById,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  brandController.remove,
);

module.exports = router;
