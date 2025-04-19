import { useState, useRef } from 'react';
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
  resetTaxResults: () => void;
}

/**
 * Custom hook to handle tax calculation logic
 */
export function useTaxCalculation(): UseTaxCalculationResult {
  const [taxResults, setTaxResults] = useState<TaxResults | undefined>(undefined);
  // Use a ref to track the previous calculation request to avoid redundant updates
  const prevRequestRef = useRef<string>("");

  const calculateTaxes = (config: TaxCalculationRequest) => {
    // Create a string representation of the config to compare against previous calculations
    const requestString = JSON.stringify(config);
    
    // Only recalculate if the request has changed
    if (prevRequestRef.current !== requestString) {
      // Calculate tax based on config
      const results = calculateTax(config);
      
      // Calculate effective tax rate (handle division by zero)
      const effectiveRate = config.income > 0 ? results.taxAfterCredits / config.income : 0;
      
      setTaxResults({
        ...results,
        effectiveRate,
        credits: config.credits
      });
      
      // Update the previous request reference
      prevRequestRef.current = requestString;
    }
  };

  // New function to reset tax results
  const resetTaxResults = () => {
    setTaxResults(undefined);
    prevRequestRef.current = "";
  };

  return { taxResults, calculateTaxes, resetTaxResults };
}