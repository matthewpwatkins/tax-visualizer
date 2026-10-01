import { FilingStatus } from "../constants/filing-status";
import { AVAILABLE_TAX_YEARS, DEFAULT_TAX_YEAR, TAX_BRACKETS } from "../constants/tax-constants";
import { TaxCalculationResult } from "../model/tax-calculation-result";
import { TaxCalculationRequest } from "../model/tax-calculation-request";
import { BracketCalculation } from "../model/bracket-calculation";

const SEARCH_PARAM_KEYS = {
  INCOME: 'income',
  FILING_STATUS: 'filingStatus',
  DEDUCTIONS: 'deductions',
  NON_REFUNDABLE_CREDITS: 'nonRefundableCredits',
  REFUNDABLE_CREDITS: 'refundableCredits',
  YEAR: 'year'
};

/** Links shared before credits were split carry a single `credits` value, which was non-refundable. */
const LEGACY_CREDITS_PARAM_KEY = 'credits';

export function getTaxCalculationRequestFromSearchParams(searchParams: URLSearchParams): TaxCalculationRequest | undefined {
  let anySet = false;
  const config: TaxCalculationRequest = {
    income: 0,
    filingStatus: FilingStatus.SINGLE,
    deductions: 0,
    nonRefundableCredits: 0,
    refundableCredits: 0,
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

  if (searchParams.has(SEARCH_PARAM_KEYS.NON_REFUNDABLE_CREDITS)) {
    anySet = true;
    config.nonRefundableCredits = Number(searchParams.get(SEARCH_PARAM_KEYS.NON_REFUNDABLE_CREDITS));
  } else if (searchParams.has(LEGACY_CREDITS_PARAM_KEY)) {
    anySet = true;
    config.nonRefundableCredits = Number(searchParams.get(LEGACY_CREDITS_PARAM_KEY));
  }

  if (searchParams.has(SEARCH_PARAM_KEYS.REFUNDABLE_CREDITS)) {
    anySet = true;
    config.refundableCredits = Number(searchParams.get(SEARCH_PARAM_KEYS.REFUNDABLE_CREDITS));
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
    [SEARCH_PARAM_KEYS.NON_REFUNDABLE_CREDITS]: taxConfig.nonRefundableCredits.toString(),
    [SEARCH_PARAM_KEYS.REFUNDABLE_CREDITS]: taxConfig.refundableCredits.toString(),
    [SEARCH_PARAM_KEYS.YEAR]: taxConfig.year.toString()
  });
}

export function calculateTax(taxConfig: TaxCalculationRequest): TaxCalculationResult {
  const taxableIncome = Math.max(0, taxConfig.income - taxConfig.deductions);
  const brackets = TAX_BRACKETS[taxConfig.year][taxConfig.filingStatus];
  const bracketCalculations: BracketCalculation[] = [];
  let totalTax = 0;

  for (const bracket of brackets) {
    const min = bracket.minIncome;
    const max = bracket.maxIncome;

    // Only the slice of income that lands between this bracket's edges is taxed at its rate
    let incomeInBracket = 0;
    if (taxableIncome > min) {
      incomeInBracket = max
        ? Math.min(taxableIncome, max) - min
        : taxableIncome - min;
    }

    const taxForBracket = incomeInBracket * bracket.rate;
    totalTax += taxForBracket;

    bracketCalculations.push({ rate: bracket.rate, min, max, incomeInBracket, taxForBracket });
  }

  // Non-refundable credits stop at zero; whatever is left over is forfeited
  const nonRefundableCreditsApplied = Math.min(totalTax, taxConfig.nonRefundableCredits);
  const nonRefundableCreditsUnused = taxConfig.nonRefundableCredits - nonRefundableCreditsApplied;

  // Refundable credits keep going past zero, and the remainder comes back as a refund
  const taxAfterCredits = totalTax - nonRefundableCreditsApplied - taxConfig.refundableCredits;

  return {
    taxableIncome,
    bracketCalculations,
    totalTax,
    nonRefundableCreditsApplied,
    nonRefundableCreditsUnused,
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

export const formatPercentPrecise = (rate: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate);
};