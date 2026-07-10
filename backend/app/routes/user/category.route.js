const express = require("express");
const categoryController = require("../../controllers/category.controller");
const router = express.Router();




// Lấy tất cả category dạng cây
router.get("/", categoryController.getAllForUser);
;

module.exports = router;
