const express = require("express");
const controller = require("../controllers/product-variant.controller");

const router = express.Router();

router.patch("/", controller.getOptions);

module.exports = router;
