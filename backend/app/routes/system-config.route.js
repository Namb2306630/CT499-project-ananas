const express = require("express");
const systemConfigController = require("../controllers/system-config.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  updateSystemSchema,
} = require("../validations/system-config.validation");
const validate = require("../middlewares/validate.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("super-admin"));

router.put("/", validate(updateSystemSchema), systemConfigController.update);
router.get("/", systemConfigController.get);

module.exports = router;
