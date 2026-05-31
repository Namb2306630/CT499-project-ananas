const express = require("express");
const addressController = require("../controllers/address.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", addressController.getAddresses);

router.post("/", addressController.createAddress);

router.put("/:id", addressController.updateAddress);

router.delete("/:id", addressController.deleteAddress);

router.patch("/:id/default", addressController.setDefault);

module.exports = router;
