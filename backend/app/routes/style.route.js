const express = require("express");

const styleController = require("../controllers/style.controller");

const router = express.Router();
router.get("/", styleController.getOptions);

module.exports = router;
