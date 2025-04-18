import { FilingStatus } from "../constants/filing-status";
import { AVAILABLE_TAX_YEARS, DEFAULT_TAX_YEAR, TAX_BRACKETS } from "../constants/tax-constants";
import { TaxCalculationResult } from "../model/tax-calculation-result";
import { TaxCalculationRequest } from "../model/tax-calculation-request";

const SEARCH_PARAM_KEYS = {
  INCOME: 'income',
  FILING_STATUS: 'filingStatus',
  DEDUCTIONS: 'deductions',
  CREDITS: 'credits',
  YEAR: 'year'
};

export function getTaxCalculationRequestFromSearchParams(searchParams: URLSearchParams): TaxCalculationRequest | undefined {
  let anySet = false;
  const config: TaxCalculationRequest = {
    income: 0,
    filingStatus: FilingStatus.SINGLE,
    deductions: 0,
    credits: 0,
    year: DEFAULT_TAX_YEAR
  };
  
  if (searchParams.has(SEARCH_PARAM_KEYS.INCOME)) {
    anySet = true;
    config.income = Number(searchParams.get(SEARCH_PARAM_KEYS.INCOME));
  }

  if (searchParams.has(SEARCH_PARAM_KEYS.FILING_STATUS)) {
    anySet = true;
    const status = searchParams.get(SEARCH_PARAM_KEYS.FILING_STATUS);
    if (Object.values(FilingStatus).includes(status as FilingStatus)) {
      config.filingStatus = status as FilingStatus;
    }
  }

  if (searchParams.has(SEARCH_PARAM_KEYS.DEDUCTIONS)) {
    anySet = true;
    config.deductions = Number(searchParams.get(SEARCH_PARAM_KEYS.DEDUCTIONS));
  }

  if (searchParams.has(SEARCH_PARAM_KEYS.CREDITS)) {
    anySet = true;
    config.credits = Number(searchParams.get(SEARCH_PARAM_KEYS.CREDITS));
  }

  if (searchParams.has(SEARCH_PARAM_KEYS.YEAR)) {
    anySet = true;
    const year = Number(searchParams.get(SEARCH_PARAM_KEYS.YEAR));
    if (AVAILABLE_TAX_YEARS.includes(year)) {
      config.year = year;
    }
  }

  return anySet ? config : undefined;
}

export function getTaxCalculationRequestSearchParams(taxConfig: TaxCalculationRequest): URLSearchParams {
  return new URLSearchParams({
    [SEARCH_PARAM_KEYS.INCOME]: taxConfig.income.toString(),
    [SEARCH_PARAM_KEYS.FILING_STATUS]: taxConfig.filingStatus,
    [SEARCH_PARAM_KEYS.DEDUCTIONS]: taxConfig.deductions.toString(),
    [SEARCH_PARAM_KEYS.CREDITS]: taxConfig.credits.toString(),
    [SEARCH_PARAM_KEYS.YEAR]: taxConfig.year.toString()
  });
}

export function calculateTax(taxConfig: TaxCalculationRequest): TaxCalculationResult {
  const result: TaxCalculationResult = {
    taxableIncome: Math.max(0, taxConfig.income - taxConfig.deductions),
    bracketCalculations: [],
    totalTax: 0,
    taxAfterCredits: 0
  };
  
  const brackets = TAX_BRACKETS[taxConfig.year][taxConfig.filingStatus];
  let totalTax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const min = bracket.minIncome;
    const max = bracket.maxIncome;

    // Calculate income that falls within this bracket
    let incomeInBracket = 0;
    if (result.taxableIncome > min) {
      incomeInBracket = max
        ? Math.min(result.taxableIncome, max) - min
        : result.taxableIncome - min;
    }

    // Calculate tax for this bracket
    const taxForBracket = incomeInBracket * bracket.rate;
    totalTax += taxForBracket;

    result.bracketCalculations.push({
      rate: bracket.rate,
      min,
      max,
      incomeInBracket,
      taxForBracket
    });
  }

  // Apply credits
  const taxAfterCredits = Math.max(0, totalTax - taxConfig.credits);

  return {
    taxableIncome: result.taxableIncome,
    bracketCalculations: result.bracketCalculations,
    totalTax,
    taxAfterCredits
  };
};

export const parseCurrencyValue = (value: string): number => {
  return Number(value.replace(/[^0-9.-]/g, ''));
};

export const formatCurrencyInput = (value: number): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercent = (rate: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(rate);
};