const express = require("express");
const controller = require("../../controllers/collection.controller");
const router = express.Router();


router.get("/", controller.getAllForUser);

router.get("/:id/products", controller.getProducts);

module.exports = router;
