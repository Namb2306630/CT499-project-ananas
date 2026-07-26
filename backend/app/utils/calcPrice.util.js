// Tính giá gốc của sản phẩm từ giá nhập
// cộng thêm % chi phí vận hành và % lợi nhuận
const calculateBasePrice = ({
  costPrice,
  operatingCostPercent,
  profitPercent,
}) => {
  const totalPercent = operatingCostPercent + profitPercent;

  return Math.round(costPrice * (1 + totalPercent / 100));
};


// Tính giá bán cuối cùng sau khi áp dụng
// phần trăm giảm giá trên giá gốc
const calculateSellingPrice = (basePrice, discountPercent = 0) => {
  return Math.round(basePrice * (1 - discountPercent / 100));
};

module.exports = {
  calculateBasePrice,
  calculateSellingPrice,
};
