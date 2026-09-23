import api from './axios';

export type CurrencyRates = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

export async function getCurrencyRates(): Promise<CurrencyRates> {
  const response = await api.get<CurrencyRates>(
    '/currency/rates',
  );

  return response.data;
}