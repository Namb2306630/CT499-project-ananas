const express = require("express");
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh-token", authMiddleware, auth.refreshToken);
router.post("/logout", auth.logout);
router.post("/forgot-password", auth.forgotPassword);

module.exports = router;
