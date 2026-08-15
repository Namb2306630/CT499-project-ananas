const express = require("express");
const controller = require("../../controllers/product-variant.controller");

const router = express.Router();

router.get("/", controller.getForUser);
router.patch("/:id", controller.updateOutOfStock);
router.get("/:id", controller.getProductDetailForUser);
router.get("/:id/:colorCode", controller.getProductColor);
router.get("/:colorCode", controller.getColors);
//Lấy tất cả variant của 1 product

module.exports = router;
