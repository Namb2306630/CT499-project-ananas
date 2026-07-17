export const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'vi-VN', {
    style: 'currency',
    currency,
  }).format(value ?? 0)
}
