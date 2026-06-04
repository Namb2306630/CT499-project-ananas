const express = require("express");
const categoryController = require("../controllers/category.controller");
const { createCategorySchema } = require("../validations/category.validation");
const validate = require("../middlewares/validate.middleware");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const { uploadCategoryImage } = require("../middlewares/upload.middleware");

const Role = require("../utils/role.util");

// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));

// Tạo category
router.post(
  "/admin/categories",
  validate(createCategorySchema),
  uploadCategoryImage,
  categoryController.create,
);

// Update category
router.put(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  uploadCategoryImage,
  categoryController.update,
);

// Xóa category
router.delete(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.remove,
);

// Lấy tất cả category dạng cây
router.get("/categories", categoryController.getAllForUser);
router.get(
  "/admin/categories",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.getAllForAdmin,
);

// Lấy 1 category
router.get(
  "/admin/categories/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.getById,
);

module.exports = router;
