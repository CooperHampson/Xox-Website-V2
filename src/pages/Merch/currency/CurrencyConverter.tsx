export function convertPrice(
  priceInCents: string,
  currencyCode: string,
  exchangeRates: Record<string, number>,
) {
  const priceInUSD = Number(priceInCents) / 100;

  const exchangeRate = exchangeRates[currencyCode] ?? 1;

  return priceInUSD * exchangeRate;
}

export function formatPrice(
  price: number,
  currencyCode: string
) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(price);
}