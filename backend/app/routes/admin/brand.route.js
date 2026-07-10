const express = require("express");
const brandController = require("../../controllers/brand.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const role = require("../../utils/role.util");
const router = express.Router();
const { uploadBrandLogo } = require("../../middlewares/upload.middleware");
const {
  createBrandSchema,
  updateBrandSchema,
} = require("../../validations/brand.validation");

// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));

router.post(
  "/",
  uploadBrandLogo,
  validate(createBrandSchema), // chỉ nhận 1 file với field name là logo
  brandController.create,
);
router.put(
  "/:id",
  uploadBrandLogo,
  validate(updateBrandSchema),
  brandController.update,
);

router.get("", brandController.getAllForAdmin);

router.get("/:slug", brandController.getBySlug);

router.delete("/:id", brandController.remove);

module.exports = router;
