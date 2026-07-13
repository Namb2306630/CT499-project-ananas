const SystemConfig = require("../models/system-config.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util");
const { deleteImage } = require("../utils/uploadImage.util");

class SystemConfigService {
  async get() {
    return await SystemConfig.findOne();
  }

  async update(payload) {
    const system = await SystemConfig.findOne();

    if (!system) throw ErrorCode.SYSTEM_NOT_EXISTS();

    updateFields(system, payload, [
      "email",
      "hotline",
      "taxCode",
      "vatRate",
      "operatingCostPercent",
      "profitPercent",
      "freeShippingThreshold",
      "currency",
      "taxDisplayStrategy",
    ]);

    await system.save();

    return system;
  }

  async updateNotFoundImage(file) {
    const system = await SystemConfig.findOne();

    if (!system) throw ErrorCode.SYSTEM_NOT_EXISTS();

    // xóa ảnh cũ
    if (system.notFoundImage) {
      deleteImage(system.notFoundImage);
    }

    // lưu đường dẫn giống Brand
    system.notFoundImage = file.path.replace(/\\/g, "/");

    await system.save();

    return system;
  }
}

module.exports = new SystemConfigService();
