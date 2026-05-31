const addressService = require("../services/address.service");
const ApiResponse = require("../constants/api-response");

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const addresses = await addressService.getAddresses(userId);

    return ApiResponse.success({
      res,
      data: addresses,
      message: "Lấy danh sách địa chỉ thành công",
    });
  } catch (err) {
    next(err);
  }
};

exports.createAddress = async (req, res, next) => {};
exports.updataAddress = async (req, res, next) => {};
exports.deleteAddress = async (req, res, next) => {};
exports.setDefault = async (req, res, next) => {};
