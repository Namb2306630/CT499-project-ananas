const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.get("/user/account/profile", userController.profile);
router.put("/user/account/profile", userController.updateProfile);
router.get("/users", userController.findAll);
router.get("/user/search", userController.findOne);

module.exports = router;
