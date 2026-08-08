const express = require("express");
const controller = require("../../controllers/product-variant-item.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const validate = require("../../middlewares/validate.middleware");


const router = express.Router();

router.get("/variant/:id", controller.getSizesByVariant);
router.get("/size/:size", controller.getSize);

module.exports = router;
