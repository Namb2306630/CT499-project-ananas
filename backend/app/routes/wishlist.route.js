const express = require("express");
const controller = require("../controllers/wishlist.controller");
const {
  createWishlist,
  updateWishlist,
  moveToCart,
} = require("../validations/wishlist.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const role = require("../utils/role.util");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post("/", authMiddleware, validate(createWishlist), controller.create);
router.post(
  "/:id/move-to-cart",
  authMiddleware,
  validate(moveToCart),
  controller.moveToCart,
);
router.put("/:id", authMiddleware, validate(updateWishlist), controller.update);

router.delete("/:id", authMiddleware, controller.removeId);

router.delete(
  "/",
  authMiddleware,
  validate(createWishlist),
  controller.removeAll,
);

router.get("/", authMiddleware, validate(createWishlist), controller.getAll);

module.exports = router;
