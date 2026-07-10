const express = require("express");
const brandController = require("../../controllers/brand.controller");
const router = express.Router();



router.get("/:brandId/lines", brandController.getByBrand);
router.get("/", brandController.getAllForUser);

module.exports = router;
