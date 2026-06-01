const Address = require("../models/address.model");
const ErrorCode = require("../constants/errors");
const REGEX = require("../utils/regex");

class AddressService {
  //lấy địa chỉ
  async getAddresses(userId) {
    //sắp xếp isDefault đứng trước
    return await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });
  }

  //thêm địa chỉ
  async createAddress(userId, payload) {
    const { isDefault } = payload;

    const count = await Address.countDocuments({ userId });

    if (isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    return await Address.create({
      ...payload,
      userId,
      isDefault: count === 0 ? true : !!isDefault,
    });
  }

  //cập nhật địa chỉ
  async updateAddress(userId, addressId, payload) {
    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    if (payload.phone != null && !REGEX.PHONE.test(payload.phone)) {
      throw ErrorCode.INVALID_PHONE();
    }

    if (payload.isDefault) {
      await Address.updateMany(
        {
          userId,
        },
        { $set: { isDefault: false } },
      );
    }

    //Copy các thuộc tính từ object nguồn sang object đích
    Object.assign(address, payload);

    await address.save();

    return address;
  }

  //xóa địa chỉ
  async deleteAddress({ userId, addressId }) {
    const address = await Address.findOne({
      _id: addressId,
      userId,
    });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    if (address.isDefault) {
      throw ErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS();
    }

    await address.deleteOne();

    return true;
  }

  //đặt địa chỉ mặc định
  async setDefaultAddress({ userId, addressId }) {
    const address = await Address.findOne({ _id: addressId, userId });

    if (!address) throw ErrorCode.ADDRESS_NOT_EXISTS();

    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    address.isDefault = true;

    await address.save();

    return address;
  }
}

module.exports = new AddressService();
