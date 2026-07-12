const express = require("express");
const controller = require("../../controllers/collection.controller");
const role = require("../../utils/role.util");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
//const { uploadCollectionImage } = require("../middlewares/upload.middleware");
const {
  createCollectionSchema,
  updateCollectionSchema,
} = require("../../validations/collection.validation");

const router = express.Router();
// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));
router.post(
  "/",
  // uploadCollectionImage,
  validate(createCollectionSchema),
  controller.create,
);
router.put(
  "/:id",
  // uploadCollectionImage,
  validate(updateCollectionSchema),
  controller.update,
);
router.delete("/:id", controller.remove);

router.get("/", controller.getAllForAdmin);

router.get("/:slug", controller.getBySlug);
module.exports = router;
