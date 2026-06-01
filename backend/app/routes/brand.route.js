const express = require("express");
const brandController = require("../controllers/brand.controller");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const { uploadImage } = require("../utils/uploadImage.util");
const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware(role.SUPER_ADMIN),
  uploadImage("brands").single("logo"),
  brandController.create,
);
router.put(
  "/:id",
  uploadImage("brands").single("logo"),
  roleMiddleware(role.SUPER_ADMIN),
  brandController.update,
);
router.get("/", brandController.getAll);
router.get("/:id", brandController.getById);
router.delete("/:id", roleMiddleware(role.SUPER_ADMIN), brandController.remove);

module.exports = router;
