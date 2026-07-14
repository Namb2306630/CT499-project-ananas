const express = require("express");

const router = express.Router();
const controller = require("../../controllers/product-type.controller");
const validate = require("../../middlewares/validate.middleware");
const validation = require("../../validations/product-type.validation");
const roleMiddleware = require("../../middlewares/role.middleware");
const role = require("../../utils/role.util");


router.get("/", controller.getUser);

module.exports = router;
