// Tax filing status enum
export enum FilingStatusEnum {
  SINGLE = 'single',
  MARRIED_JOINT = 'marriedJoint',
  MARRIED_SEPARATE = 'marriedSeparate',
  HEAD_OF_HOUSEHOLD = 'headOfHousehold'
}

// Tax bracket display constants
export const DISPLAY_CONSTANTS = {
  MIN_PROGRESS_BAR_HEIGHT: 24,
  PERCENTAGE_WIDTH: 40,
  FULL_TEXT: 'Full',
  LEFT_TEXT: ' left'
};

// Tax filing status types (using the enum)
export type FilingStatus = FilingStatusEnum;

// Interface for tax bracket information
export interface TaxBracket {
  rate: number;
  minIncome: number;
  maxIncome: number | null;
}

// Interface for bracket calculation results
export interface BracketCalculation {
  rate: number;
  min: number;
  max: number | null;
  incomeInBracket: number;
  taxForBracket: number;
}

// Standard deductions by filing status and year
export const standardDeductions: Record<number, Record<FilingStatus, number>> = {
  2025: {
    [FilingStatusEnum.SINGLE]: 14600,
    [FilingStatusEnum.MARRIED_JOINT]: 29200,
    [FilingStatusEnum.MARRIED_SEPARATE]: 14600,
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: 21900
  },
  2024: {
    [FilingStatusEnum.SINGLE]: 13850,
    [FilingStatusEnum.MARRIED_JOINT]: 27700,
    [FilingStatusEnum.MARRIED_SEPARATE]: 13850,
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: 20800
  },
  2023: {
    [FilingStatusEnum.SINGLE]: 13850,
    [FilingStatusEnum.MARRIED_JOINT]: 27700,
    [FilingStatusEnum.MARRIED_SEPARATE]: 13850,
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: 20800
  }
};

// Tax brackets for different filing statuses and years
export const taxBrackets: Record<number, Record<FilingStatus, TaxBracket[]>> = {
  2025: {
    [FilingStatusEnum.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578125 },
      { rate: 0.37, minIncome: 578125, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 22000 },
      { rate: 0.12, minIncome: 22000, maxIncome: 89450 },
      { rate: 0.22, minIncome: 89450, maxIncome: 190750 },
      { rate: 0.24, minIncome: 190750, maxIncome: 364200 },
      { rate: 0.32, minIncome: 364200, maxIncome: 462500 },
      { rate: 0.35, minIncome: 462500, maxIncome: 693750 },
      { rate: 0.37, minIncome: 693750, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 346875 },
      { rate: 0.37, minIncome: 346875, maxIncome: null }
    ],
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 15700 },
      { rate: 0.12, minIncome: 15700, maxIncome: 59850 },
      { rate: 0.22, minIncome: 59850, maxIncome: 95350 },
      { rate: 0.24, minIncome: 95350, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578100 },
      { rate: 0.37, minIncome: 578100, maxIncome: null }
    ]
  },
  2024: {
    [FilingStatusEnum.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11600 },
      { rate: 0.12, minIncome: 11600, maxIncome: 47150 },
      { rate: 0.22, minIncome: 47150, maxIncome: 100525 },
      { rate: 0.24, minIncome: 100525, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243725 },
      { rate: 0.35, minIncome: 243725, maxIncome: 609350 },
      { rate: 0.37, minIncome: 609350, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 23200 },
      { rate: 0.12, minIncome: 23200, maxIncome: 94300 },
      { rate: 0.22, minIncome: 94300, maxIncome: 201050 },
      { rate: 0.24, minIncome: 201050, maxIncome: 383900 },
      { rate: 0.32, minIncome: 383900, maxIncome: 487450 },
      { rate: 0.35, minIncome: 487450, maxIncome: 731200 },
      { rate: 0.37, minIncome: 731200, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11600 },
      { rate: 0.12, minIncome: 11600, maxIncome: 47150 },
      { rate: 0.22, minIncome: 47150, maxIncome: 100525 },
      { rate: 0.24, minIncome: 100525, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243725 },
      { rate: 0.35, minIncome: 243725, maxIncome: 365600 },
      { rate: 0.37, minIncome: 365600, maxIncome: null }
    ],
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 16550 },
      { rate: 0.12, minIncome: 16550, maxIncome: 63100 },
      { rate: 0.22, minIncome: 63100, maxIncome: 100500 },
      { rate: 0.24, minIncome: 100500, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243700 },
      { rate: 0.35, minIncome: 243700, maxIncome: 609350 },
      { rate: 0.37, minIncome: 609350, maxIncome: null }
    ]
  },
  2023: {
    [FilingStatusEnum.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578125 },
      { rate: 0.37, minIncome: 578125, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 22000 },
      { rate: 0.12, minIncome: 22000, maxIncome: 89450 },
      { rate: 0.22, minIncome: 89450, maxIncome: 190750 },
      { rate: 0.24, minIncome: 190750, maxIncome: 364200 },
      { rate: 0.32, minIncome: 364200, maxIncome: 462500 },
      { rate: 0.35, minIncome: 462500, maxIncome: 693750 },
      { rate: 0.37, minIncome: 693750, maxIncome: null }
    ],
    [FilingStatusEnum.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 346875 },
      { rate: 0.37, minIncome: 346875, maxIncome: null }
    ],
    [FilingStatusEnum.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 15700 },
      { rate: 0.12, minIncome: 15700, maxIncome: 59850 },
      { rate: 0.22, minIncome: 59850, maxIncome: 95350 },
      { rate: 0.24, minIncome: 95350, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578100 },
      { rate: 0.37, minIncome: 578100, maxIncome: null }
    ]
  }
};

// Available tax years
export const AVAILABLE_TAX_YEARS = [2023, 2024, 2025];
export const DEFAULT_TAX_YEAR = 2025;

// Configuration class for tax parameters
export class TaxConfig {
  income: number;
  filingStatus: FilingStatus;
  deductions: number;
  credits: number;
  year: number;

  constructor({
    income = 75000,
    filingStatus = FilingStatusEnum.SINGLE,
    deductions,
    credits = 0,
    year = DEFAULT_TAX_YEAR
  }: Partial<TaxConfig> = {}) {
    this.income = income;
    this.filingStatus = filingStatus;
    this.year = AVAILABLE_TAX_YEARS.includes(year) ? year : DEFAULT_TAX_YEAR;
    this.credits = credits;
    
    // If no deductions provided, use standard deduction
    this.deductions = deductions ?? getStandardDeduction(this.filingStatus, this.year);
  }

  // Create a config from URL search params
  static fromSearchParams(searchParams: URLSearchParams): TaxConfig {
    const config: Partial<TaxConfig> = {};
    
    if (searchParams.has('income')) {
      config.income = Number(searchParams.get('income'));
    }

    if (searchParams.has('filingStatus')) {
      const status = searchParams.get('filingStatus');
      if (Object.values(FilingStatusEnum).includes(status as FilingStatusEnum)) {
        config.filingStatus = status as FilingStatus;
      }
    }

    if (searchParams.has('deductions')) {
      config.deductions = Number(searchParams.get('deductions'));
    }

    if (searchParams.has('credits')) {
      config.credits = Number(searchParams.get('credits'));
    }

    if (searchParams.has('year')) {
      const year = Number(searchParams.get('year'));
      if (AVAILABLE_TAX_YEARS.includes(year)) {
        config.year = year;
      }
    }

    return new TaxConfig(config);
  }

  // Convert config to URL search params
  toSearchParams(): URLSearchParams {
    const searchParams = new URLSearchParams();
    
    searchParams.set('income', this.income.toString());
    searchParams.set('filingStatus', this.filingStatus);
    searchParams.set('deductions', this.deductions.toString());
    searchParams.set('credits', this.credits.toString());
    searchParams.set('year', this.year.toString());
    
    return searchParams;
  }

  // Update URL with current config
  updateUrl(): void {
    const searchParams = this.toSearchParams();
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  }

  // Validate that the config has valid values
  validate(): boolean {
    return (
      !isNaN(this.income) && 
      this.income >= 0 &&
      Object.values(FilingStatusEnum).includes(this.filingStatus as FilingStatusEnum) &&
      !isNaN(this.deductions) && 
      this.deductions >= 0 &&
      !isNaN(this.credits) && 
      this.credits >= 0 &&
      AVAILABLE_TAX_YEARS.includes(this.year)
    );
  }
}

// Function to get standard deduction for a specific filing status and year
export const getStandardDeduction = (filingStatus: FilingStatus, year: number): number => {
  // Default to the most recent year if the selected year isn't available
  const yearToUse = standardDeductions[year] ? year : parseInt(Object.keys(standardDeductions).reduce((a, b) => 
    Number(a) > Number(b) ? a : b));
  
  return standardDeductions[yearToUse][filingStatus];
};

// Calculate tax for a given income, filing status, deductions, credits, and year
export const calculateTax = (
  income: number,
  filingStatus: FilingStatus,
  deductions: number,
  credits: number,
  year: number
): {
  taxableIncome: number;
  bracketCalculations: BracketCalculation[];
  totalTax: number;
  taxAfterCredits: number;
} => {
  // Default to the most recent year if the selected year isn't available
  const yearToUse = taxBrackets[year] ? year : parseInt(Object.keys(taxBrackets).reduce((a, b) => 
    Number(a) > Number(b) ? a : b));
  
  // Calculate taxable income (income minus deductions)
  const taxableIncome = Math.max(0, income - deductions);
  
  // Get the appropriate brackets for the filing status and year
  const brackets = taxBrackets[yearToUse][filingStatus];
  
  // Calculate tax for each bracket
  const bracketCalculations: BracketCalculation[] = [];
  
  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i];
    const min = bracket.minIncome;
    const max = bracket.maxIncome;
    
    // Calculate income that falls within this bracket
    let incomeInBracket = 0;
    if (taxableIncome > min) {
      incomeInBracket = max === null 
        ? taxableIncome - min 
        : Math.min(taxableIncome, max) - min;
    }
    
    // Calculate tax for this bracket
    const taxForBracket = incomeInBracket * bracket.rate;
    
    bracketCalculations.push({
      rate: bracket.rate,
      min,
      max,
      incomeInBracket,
      taxForBracket
    });
  }
  
  // Calculate total tax
  const totalTax = bracketCalculations.reduce((sum, bracket) => sum + bracket.taxForBracket, 0);
  
  // Apply credits
  const taxAfterCredits = Math.max(0, totalTax - credits);
  
  return {
    taxableIncome,
    bracketCalculations,
    totalTax,
    taxAfterCredits
  };
};

// Parse currency string to number
export const parseCurrencyValue = (value: string): number => {
  // Remove currency symbols, commas, and other non-numeric characters except decimal point
  const sanitized = value.replace(/[^0-9.-]/g, '');
  // Convert to number
  return Number(sanitized);
};

// Format number as currency string with commas and cents
export const formatCurrencyInput = (value: number): string => {
  // Format with commas and exactly 2 decimal places
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Format currency values
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format percentage values
export const formatPercent = (rate: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(rate);
};