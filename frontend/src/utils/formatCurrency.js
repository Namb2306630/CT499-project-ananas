export const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(value ?? 0)
}

export const formatProfit = (costPrice, sellingPrice, currency = 'VND') => {
  const profit = sellingPrice - costPrice
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(profit ?? 0)
}

export const calculateProfitPercent = (costPrice, sellingPrice) => {
  if (!costPrice || costPrice <= 0) return 0

  return (((sellingPrice - costPrice) / costPrice) * 100).toFixed(2)
}

export const calculateOriginalPrice = (costPrice, systemConfig) => {
  if (!costPrice || !systemConfig) return 0

  const operatingCost = costPrice * (systemConfig.operatingCostPercent / 100)

  const profit = costPrice * (systemConfig.profitPercent / 100)

  return Math.round(costPrice + operatingCost + profit)
}

export const calculateSellingPrice = (costPrice, discountPercent, systemConfig) => {
  const originalPrice = calculateOriginalPrice(costPrice, systemConfig)

  if (!originalPrice) return 0

  return Math.round(originalPrice * (1 - (discountPercent || 0) / 100))
}
