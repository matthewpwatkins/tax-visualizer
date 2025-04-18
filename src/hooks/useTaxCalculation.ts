import { useState } from 'react';
import { TaxCalculationRequest } from '../model/tax-calculation-request';
import { TaxCalculationResult } from '../model/tax-calculation-result';
import { calculateTax } from '../utils/tax-utils';

interface TaxResults extends TaxCalculationResult {
  effectiveRate: number;
  credits: number;
}

interface UseTaxCalculationResult {
  taxResults: TaxResults | undefined;
  calculateTaxes: (config: TaxCalculationRequest) => void;
}

/**
 * Custom hook to handle tax calculation logic
 */
export function useTaxCalculation(): UseTaxCalculationResult {
  const [taxResults, setTaxResults] = useState<TaxResults | undefined>(undefined);

  const calculateTaxes = (config: TaxCalculationRequest) => {
    // Calculate tax based on config
    const results = calculateTax(config);
    
    // Calculate effective tax rate (handle division by zero)
    const effectiveRate = config.income > 0 ? results.taxAfterCredits / config.income : 0;
    
    setTaxResults({
      ...results,
      effectiveRate,
      credits: config.credits
    });
  };

  return { taxResults, calculateTaxes };
}