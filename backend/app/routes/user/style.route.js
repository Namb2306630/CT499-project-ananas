const express = require("express");
const styleController = require("../../controllers/style.controller");
const router = express.Router();

router.get("/", styleController.getAllForUser);
router.get("/:id/products", styleController.getProducts);

module.exports = router;
