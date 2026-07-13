const SystemConfig = require("../models/system-config.model");

const systemConfigSeed = async () => {
  const exists = await SystemConfig.findOne();

  if (exists) {
    return;
  }

  await SystemConfig.create({
    taxCode: "B00000000000000",

    email: "support@ananas.vn",
    hotline: "1900 1234",

    vatPercent: 1.5,
    vatRate: 1,
    personalIncomeTaxRate: 0.5,

    operatingCostPercent: 15,
    profitPercent: 20,

    freeShippingThreshold: 500000,

    currency: "VND",
    taxDisplayStrategy: "included",

    notFoundImage: "/upload/system/page_not_found.png",
  });

};

module.exports = systemConfigSeed;
