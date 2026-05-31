const Address = require("../models/address.model");
const ErrorCode = require("../constants/errors");

class AddressService {
  //lấy địa chỉ
  async getAddesses(userId) {
    //sắp xếp isDefault đứng trước
    return await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });
  }

  //thêm địa chỉ
  async createAddress(userId, payload) {
    const { displayName, phone, province, district, ward, detail, isDefault } =
      payload;

    const count = await Address.countDocuments({ userId });

    if (isDefault) {
      await Address.updateMany(
        { userId },
        {
          $set: { isDefault: false },
        },
      );
    }

    const address = await Address.create({
      userId,
      displayName,
      phone,
      province,
      district,
      ward,
      detail,
      isDefault: count === 0 ? true : !!isDefault,
    });

    return address;
  }

  //cập nhật địa chỉ
  async updateAddress(userId, addressId, payload) {
    const address = Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    if (payload.isDefault) {
      await Address.updateMany(
        {
          userId,
        },
        { $set: { isDefault: false } },
      );
    }

    Object.assign(address, payload);

    await address.save();

    return address;
  }

  //xóa địa chỉ
  async deleteAddress(userId, addressId) {
    const address = await Address.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    return true;
  }

  //đặt địa chỉ mặc định
  async setDefaultAddress(userId, addressId) {
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    address.isDefault = true;

    await address.save();

    return address;
  }
}

module.exports = new AddressService();
