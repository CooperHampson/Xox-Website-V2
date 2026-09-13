import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode}) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);

  return (
    <CurrencyContext.Provider value={{currentCurrency, setCurrentCurrency,}}>
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