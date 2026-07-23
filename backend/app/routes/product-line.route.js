const express = require("express");
const productLineController = require("../controllers/product-line.controller");

const router = express.Router();

router.get("/", productLineController.getOptions);

module.exports = router;
