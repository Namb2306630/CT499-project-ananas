const addressService = require("../services/address.service");
const ApiResponse = require("../constants/api-response");

exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const data = await addressService.getAddresses(userId);

    return ApiResponse.success({
      res,
      data,
      message: "Lấy danh sách địa chỉ thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.createAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const data = await addressService.createAddress(userId, req.body);

    return ApiResponse.success({
      res,
      data,
      message: "Thêm địa chỉ giao hàng thành công",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
exports.updateAddress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.body.addressId;
    const data = await addressService.updateAddress(
      userId,
      addressId,
      req.body,
    );
    return ApiResponse.success({
      res,
      data: data,
      message: "Cập nhật địa chỉ giao hàng thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteAddress = async (req, res, next) => {
  try {
    await addressService.deleteAddress({
      userId: req.user._id,
      addressId: req.body.addressId,
    });

    return ApiResponse.success({
      res,
      data: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (err) {
    next(err);
  }
};
exports.setDefault = async (req, res, next) => {
  try {
    const data = await addressService.setDefaultAddress({
      userId: req.user._id,
      addressId: req.body.addressId,
    });

    return ApiResponse.success({
      res,
      message: "Thay đổi địa chỉ mặc định thành công",
      data: data,
    });
  } catch (err) {
    next(err);
  }
};
