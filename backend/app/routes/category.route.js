const express = require("express");
const categoryController = require("../controllers/category.controller");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/category.validation");
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
  "/admin",
  uploadCategoryImage,
  validate(createCategorySchema),
  categoryController.create,
);

// Update category
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  uploadCategoryImage,
  validate(updateCategorySchema),
  categoryController.update,
);

// Xóa category
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.remove,
);

// Lấy tất cả category dạng cây
router.get("/", categoryController.getAllForUser);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.getAllForAdmin,
);

// Lấy 1 category
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(Role.SUPER_ADMIN),
  categoryController.getById,
);

module.exports = router;
