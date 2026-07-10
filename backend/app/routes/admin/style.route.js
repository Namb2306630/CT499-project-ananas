const express = require("express");

const styleController = require("../../controllers/style.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const roleMiddleware = require("../../middlewares/role.middleware");
const validate = require("../../middlewares/validate.middleware");

const role = require("../../utils/role.util");

const {
  createStyleSchema,
  updateStyleSchema,
} = require("../../validations/style.validation");

const router = express.Router();
// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));
router.post("/", validate(createStyleSchema), styleController.create);

router.put("/:id", validate(updateStyleSchema), styleController.update);

router.delete("/:id", styleController.remove);

router.get("/", styleController.getAllForAdmin);

router.get("/:id", styleController.getById);

module.exports = router;
