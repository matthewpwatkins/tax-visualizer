import { useState, useRef, useCallback } from 'react';
import { TaxCalculationRequest } from '../model/tax-calculation-request';
import { TaxCalculationResult } from '../model/tax-calculation-result';
import { calculateTax } from '../utils/tax-utils';

interface TaxResults extends TaxCalculationResult {
  effectiveRate: number;
  refundableCredits: number;
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
  // Use a ref to track the previous calculation request to avoid redundant updates
  const prevRequestRef = useRef<string>("");

  const calculateTaxes = useCallback((config: TaxCalculationRequest) => {
    // Create a string representation of the config to compare against previous calculations
    const requestString = JSON.stringify(config);

    // Only recalculate if the request has changed
    if (prevRequestRef.current !== requestString) {
      // Calculate tax based on config
      const results = calculateTax(config);

      // Negative when credits outrun the tax owed, which reads as a refund rather than a rate
      const effectiveRate = config.income > 0 ? results.taxAfterCredits / config.income : 0;

      setTaxResults({
        ...results,
        effectiveRate,
        refundableCredits: config.refundableCredits
      });

      // Update the previous request reference
      prevRequestRef.current = requestString;
    }
  }, []); // Empty dependency array: calculateTax itself doesn't depend on changing values from this hook's scope

  return { taxResults, calculateTaxes };
}