const express = require("express");
const controller = require("../controllers/product-type.controller");
const router = express.Router();
router.get("/", controller.getOptions);

module.exports = router;
