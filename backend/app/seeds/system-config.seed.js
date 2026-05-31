const SystemConfig = require("../models/system-config.model");

const systemConfigSeed = async () => {
  const exists = await SystemConfig.findOne();

  if (exists) return;

  await SystemConfig.create({
    vatPercent: 1.5,
    operatingCostPercent: 15,
    profitPercent: 20,
    freeShippingThreshold: 500000,
  });
};

module.exports = systemConfigSeed;
