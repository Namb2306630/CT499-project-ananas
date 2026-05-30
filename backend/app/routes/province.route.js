const express = require("express");
const provinceController = require("../controllers/province.controller");

const router = express.Router();

router.get("/provinces", provinceController.getProvinces);
router.get("/provinces/:code/districts", provinceController.getDistricts);
router.get("/districts/:code/wards", provinceController.getWards);

module.exports = router;
