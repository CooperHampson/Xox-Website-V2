export const exchangeRates: Record<string, number> = {
  USD: 1,
  JPY: 150,
  AUD: 1.5,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  NZD: 1.63,
};

export function convertPrice(
  priceInCents: string,
  currencyCode: string
) {
  const priceInUSD = Number(priceInCents) / 100;

  const convertedPrice = priceInUSD * exchangeRates[currencyCode];

  return convertedPrice;
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