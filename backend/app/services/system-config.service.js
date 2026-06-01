const SystemConfig = require("../models/system-config.model");
const ErrorCode = require("../constants/errors");

class SystemConfigService {
  async get() {
    return await SystemConfig.findOne();
  }

  async update(payload) {
    const system = await SystemConfig.findOne();
    if (!system) throw ErrorCode.SYSTEM_NOT_EXISTS();

    if (
      payload.vatPercent != null &&
      (payload.vatPercent < 0 || payload.vatPercent > 100)
    ) {
      throw ErrorCode.INVALID_VAT_PERCENT();
    }

    if (
      payload.operatingCostPercent != null &&
      (payload.operatingCostPercent < 0 || payload.operatingCostPercent > 100)
    ) {
      throw ErrorCode.INVALID_OPERATING_COST_PERCENT();
    }

    if (
      payload.profitPercent != null &&
      (payload.profitPercent < 0 || payload.profitPercent > 100)
    ) {
      throw ErrorCode.INVALID_PROFIT_PERCENT();
    }

    if (
      payload.freeShippingThreshold != null &&
      payload.freeShippingThreshold < 0
    ) {
      throw ErrorCode.INVALID_FREE_SHIPPING_THRESHOLD();
    }
    Object.assign(system, payload);

    await system.save();

    return system;
  }
}
module.exports = new SystemConfigService();
