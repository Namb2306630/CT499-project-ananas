const SystemConfig = require("../models/system-config.model");
const ErrorCode = require("../constants/errors");

class SystemConfigService {
  async get() {
    return await SystemConfig.findOne();
  }

  async update(payload) {
    const system = await SystemConfig.findOne();
    if (!system) throw ErrorCode.SYSTEM_NOT_EXISTS();
    Object.assign(system, payload);
    await system.save();
    return system;
  }
}
module.exports = new SystemConfigService();
