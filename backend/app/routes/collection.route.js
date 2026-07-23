const express = require("express");
const controller = require("../controllers/collection.controller");
const router = express.Router();

router.get("/", controller.getOptions);

module.exports = router;
