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
  "/",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  validate(createBrandSchema),
  uploadBrandLogo, // chỉ nhận 1 file với field name là logo
  brandController.create,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  uploadBrandLogo,
  brandController.update,
);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getById);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  brandController.remove,
);

module.exports = router;
