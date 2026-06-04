const express = require("express");
const provinceController = require("../controllers/province.controller");

const router = express.Router();

router.get("/", provinceController.getProvinces);
router.get("/:code/districts", provinceController.getDistricts);
router.get("/districts/:code/wards", provinceController.getWards);

module.exports = router;
