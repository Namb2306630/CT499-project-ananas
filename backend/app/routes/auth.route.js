const express = require("express");
const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.get("/me", authMiddleware, auth.me);

router.post("/register", validate(registerSchema), auth.register);

router.post("/login", validate(loginSchema), auth.login);

router.post("/refresh-token", auth.refreshToken);

router.post("/logout", auth.logout);

router.post("/forgot-password", auth.forgotPassword);

module.exports = router;
