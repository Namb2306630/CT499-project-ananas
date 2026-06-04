const calculateBasePrice = ({
  costPrice,
  vatPercent,
  operatingCostPercent,
  profitPercent,
}) => {
  const totalPercent = vatPercent + operatingCostPercent + profitPercent;

  return Math.round(costPrice * (1 + totalPercent / 100));
};

const calculateSellingPrice = (basePrice, discountPercent = 0) => {
  return Math.round(basePrice * (1 - discountPercent / 100));
};

module.exports = {
  calculateBasePrice,
  calculateSellingPrice,
};
