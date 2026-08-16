//loại tiền
export const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(value ?? 0)
}

//định dạng lợi nhuận
export const formatProfit = (costPrice, sellingPrice, currency = 'VND') => {
  const profit = sellingPrice - costPrice
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(profit ?? 0)
}

export const formatFreeShip = (costPrice, currency = 'VND') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(costPrice ?? 0)
}

export const formatPrice = (costPrice, currency = 'VND') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(costPrice ?? 0)
}

// % lợi nhuận
export const calculateProfitPercent = (costPrice, sellingPrice) => {
  if (!costPrice || costPrice <= 0) return 0

  return (((sellingPrice - costPrice) / costPrice) * 100).toFixed(2)
}

//tính giá gốc
export const calculateOriginalPrice = (costPrice, systemConfig) => {
  if (!costPrice || !systemConfig) return 0

  const operatingCost = costPrice * (systemConfig.operatingCostPercent / 100)

  const profit = costPrice * (systemConfig.profitPercent / 100)

  return Math.round(costPrice + operatingCost + profit)
}

//tính giá bán
export const calculateSellingPrice = (costPrice, discountPercent, systemConfig) => {
  const originalPrice = calculateOriginalPrice(costPrice, systemConfig)

  if (!originalPrice) return 0

  return Math.round(originalPrice * (1 - (discountPercent || 0) / 100))
}
