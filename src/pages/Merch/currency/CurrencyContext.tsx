import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCurrencyRates } from "../../../api/currencyApi";

export interface Currency {
  code: string;
  symbol: string;
  label: string;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: '$', label: 'Australian Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'Great British Pound' },
  { code: 'CAD', symbol: '$', label: 'Canadian Dollar' },
  { code: 'NZD', symbol: '$', label: 'New Zealand Dollar' },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrentCurrency: (currency: Currency) => void;
  exchangeRates: Record<string, number>;
  isRatesLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode}) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1,});
  const [isRatesLoading, setIsRatesLoading] = useState(true);

  useEffect(() => {
    async function loadRates() {
      try {
        const data = await getCurrencyRates();

        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to load exchange rates:", error);
      } finally {
        setIsRatesLoading(false);
      }
    }

    loadRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{currentCurrency, setCurrentCurrency, exchangeRates, isRatesLoading}}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      'useCurrency must be used inside a CurrencyProvider'
    );
  }

  return context;
}