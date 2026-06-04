const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const router = express.Router();
const { uploadBrandLogo } = require("../middlewares/upload.middleware");
const { createBrandSchema } = require("../validations/brand.validation");

//router.use(authMiddleware);

router.post(
  "/admin/brands",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createBrandSchema),
  uploadBrandLogo, // chỉ nhận 1 file với field name là logo
  brandController.create,
);
router.put(
  "/admin/brands/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadBrandLogo,
  brandController.update,
);
router.get(
  "/admin/brands",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  brandController.getAllForAdmin,
);
router.get("/brands", brandController.getAllForUser);
router.get(
  "/brands/:id",
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
