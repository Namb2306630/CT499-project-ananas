const express = require("express");
const controller = require("../controllers/collection.controller");
const role = require("../utils/role.util");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
//const { uploadCollectionImage } = require("../middlewares/upload.middleware");
const {
  createCollectionSchema,
  updateCollectionSchema,
} = require("../validations/collection.validation");

const router = express.Router();

router.post(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  //uploadCollectionImage,
  validate(createCollectionSchema),
  controller.create,
);
router.put(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  //uploadCollectionImage,
  validate(updateCollectionSchema),
  controller.update,
);
router.delete(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  controller.remove,
);
router.get("/", controller.getAllForUser);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  controller.getAllForAdmin,
);

router.get("/:id/products", controller.getProducts);
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(role.SUPER_ADMIN),
  controller.getById,
);
module.exports = router;
