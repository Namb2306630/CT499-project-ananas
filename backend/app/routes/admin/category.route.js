const express = require("express");
const categoryController = require("../../controllers/category.controller");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../../validations/category.validation");
const validate = require("../../middlewares/validate.middleware");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const { uploadCategoryImage } = require("../../middlewares/upload.middleware");

const Role = require("../../utils/role.util");

router.use(authMiddleware);
router.use(roleMiddleware(Role.SUPER_ADMIN));

// Tạo category
router.post(
  "/",
  uploadCategoryImage,
  validate(createCategorySchema),
  categoryController.create,
);

// Update category
router.put(
  "/:id",
  uploadCategoryImage,
  validate(updateCategorySchema),
  categoryController.update,
);

// Xóa category
router.delete("/:id", categoryController.remove);

router.get("/", categoryController.getAllForAdmin);

// Lấy 1 category
router.get("/:slug", categoryController.getBySlug);

module.exports = router;
