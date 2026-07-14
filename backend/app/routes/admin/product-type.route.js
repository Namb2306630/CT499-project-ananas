const express = require("express");

const router = express.Router();
const controller = require("../../controllers/product-type.controller");
const validate = require("../../middlewares/validate.middleware");
const validation = require("../../validations/product-type.validation");
const roleMiddleware = require("../../middlewares/role.middleware");
const role = require("../../utils/role.util");
const authMiddleware = require("../../middlewares/auth.middleware");

// router.use(authMiddleware);
// router.use(roleMiddleware(Role.SUPER_ADMIN));

router.get("/", controller.getAdmin);
router.post("/", validate(validation.create), controller.create);
router.put("/:id", validate(validation.update), controller.update);
router.delete("/:id", controller.delete);
router.get("/:slug", controller.getBySlug);
module.exports = router;
