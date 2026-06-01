const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/account/profile", userController.profile);
router.put("/account/profile", userController.updateProfile);
router.get("/", userController.findAll);
router.get("/search", userController.findOne);

module.exports = router;
