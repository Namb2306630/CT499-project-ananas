const express = require("express");
const addressController = require("../controllers/address.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createAddressSchema,
  updateAddressSchema,
} = require("../validations/address.validation");
const router = express.Router();

router.use(authMiddleware);

router.get("/", addressController.getAddresses);

router.post(
  "/",
  validate(createAddressSchema),
  addressController.createAddress,
);

router.put(
  "/:id",
  validate(updateAddressSchema),
  addressController.updateAddress,
);

router.delete("/:id", addressController.deleteAddress);

router.patch("/:id/default", addressController.setDefault);

router.get("/:id", addressController.getById);

module.exports = router;
