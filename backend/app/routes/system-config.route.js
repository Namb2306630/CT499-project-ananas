const express = require("express");
const systemConfigController = require("../controllers/system-config.controller");
const router = express.Router();



router.get("/", systemConfigController.get);


module.exports = router;
