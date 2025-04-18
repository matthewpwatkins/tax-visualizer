import { useState, useEffect } from 'react';
import { TaxCalculationRequest } from '../model/tax-calculation-request';
import { getTaxCalculationRequestFromSearchParams, getTaxCalculationRequestSearchParams } from '../utils/tax-utils';

interface UseTaxParamsResult {
  initialConfig: TaxCalculationRequest | undefined;
  urlChecked: boolean;
  updateUrlWithConfig: (config: TaxCalculationRequest) => void;
}

/**
 * Custom hook to handle URL parameter management for tax configurations
 */
export function useTaxParams(): UseTaxParamsResult {
  const [initialConfig, setInitialConfig] = useState<TaxCalculationRequest | undefined>(undefined);
  const [urlChecked, setUrlChecked] = useState(false);

  useEffect(() => {
    // Parse query parameters when the component mounts
    const searchParams = new URLSearchParams(window.location.search);
    
    // Get config from search params if available
    const config = getTaxCalculationRequestFromSearchParams(searchParams);
    
    // Mark that we've checked the URL
    setUrlChecked(true);
    
    // If config exists, set it as initial config
    if (config) {
      setInitialConfig(config);
    }
  }, []);

  // Function to update URL with new config
  const updateUrlWithConfig = (config: TaxCalculationRequest) => {
    const searchParams = getTaxCalculationRequestSearchParams(config);
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  return { initialConfig, urlChecked, updateUrlWithConfig };
}