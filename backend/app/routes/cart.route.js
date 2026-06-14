const express = require("express");
const controller = require("../controllers/cart.controller");
const { createCart, updateCart } = require("../validations/cart.validation");
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");

const router = express.Router();

router.post("/", authMiddleware, validate(createCart), controller.create);
router.put("/:id", authMiddleware, validate(updateCart), controller.update);
router.delete("/:id", authMiddleware, controller.removeId);
router.delete("/", authMiddleware, controller.removeAll);
router.get("/", authMiddleware, controller.getAll);

module.exports = router;
