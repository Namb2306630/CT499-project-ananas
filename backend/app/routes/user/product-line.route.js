const express = require("express");
const productLineController = require("../../controllers/product-line.controller");

const router = express.Router();


router.get("/", productLineController.getAllForUser);
router.get("/:id/products", productLineController.getProducts);

module.exports = router;
