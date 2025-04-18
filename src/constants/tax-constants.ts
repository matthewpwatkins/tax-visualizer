import { TaxCalculationRequest } from "../model/tax-calculation-request";
import { FilingStatus } from "./filing-status";
import { TaxBracket } from "./tax-bracket";

export const TAX_BRACKETS: Record<number, Record<FilingStatus, TaxBracket[]>> = {
  2025: {
    [FilingStatus.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578125 },
      { rate: 0.37, minIncome: 578125, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 22000 },
      { rate: 0.12, minIncome: 22000, maxIncome: 89450 },
      { rate: 0.22, minIncome: 89450, maxIncome: 190750 },
      { rate: 0.24, minIncome: 190750, maxIncome: 364200 },
      { rate: 0.32, minIncome: 364200, maxIncome: 462500 },
      { rate: 0.35, minIncome: 462500, maxIncome: 693750 },
      { rate: 0.37, minIncome: 693750, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 346875 },
      { rate: 0.37, minIncome: 346875, maxIncome: undefined }
    ],
    [FilingStatus.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 15700 },
      { rate: 0.12, minIncome: 15700, maxIncome: 59850 },
      { rate: 0.22, minIncome: 59850, maxIncome: 95350 },
      { rate: 0.24, minIncome: 95350, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578100 },
      { rate: 0.37, minIncome: 578100, maxIncome: undefined }
    ]
  },
  2024: {
    [FilingStatus.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11600 },
      { rate: 0.12, minIncome: 11600, maxIncome: 47150 },
      { rate: 0.22, minIncome: 47150, maxIncome: 100525 },
      { rate: 0.24, minIncome: 100525, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243725 },
      { rate: 0.35, minIncome: 243725, maxIncome: 609350 },
      { rate: 0.37, minIncome: 609350, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 23200 },
      { rate: 0.12, minIncome: 23200, maxIncome: 94300 },
      { rate: 0.22, minIncome: 94300, maxIncome: 201050 },
      { rate: 0.24, minIncome: 201050, maxIncome: 383900 },
      { rate: 0.32, minIncome: 383900, maxIncome: 487450 },
      { rate: 0.35, minIncome: 487450, maxIncome: 731200 },
      { rate: 0.37, minIncome: 731200, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11600 },
      { rate: 0.12, minIncome: 11600, maxIncome: 47150 },
      { rate: 0.22, minIncome: 47150, maxIncome: 100525 },
      { rate: 0.24, minIncome: 100525, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243725 },
      { rate: 0.35, minIncome: 243725, maxIncome: 365600 },
      { rate: 0.37, minIncome: 365600, maxIncome: undefined }
    ],
    [FilingStatus.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 16550 },
      { rate: 0.12, minIncome: 16550, maxIncome: 63100 },
      { rate: 0.22, minIncome: 63100, maxIncome: 100500 },
      { rate: 0.24, minIncome: 100500, maxIncome: 191950 },
      { rate: 0.32, minIncome: 191950, maxIncome: 243700 },
      { rate: 0.35, minIncome: 243700, maxIncome: 609350 },
      { rate: 0.37, minIncome: 609350, maxIncome: undefined }
    ]
  },
  2023: {
    [FilingStatus.SINGLE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578125 },
      { rate: 0.37, minIncome: 578125, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_JOINT]: [
      { rate: 0.10, minIncome: 0, maxIncome: 22000 },
      { rate: 0.12, minIncome: 22000, maxIncome: 89450 },
      { rate: 0.22, minIncome: 89450, maxIncome: 190750 },
      { rate: 0.24, minIncome: 190750, maxIncome: 364200 },
      { rate: 0.32, minIncome: 364200, maxIncome: 462500 },
      { rate: 0.35, minIncome: 462500, maxIncome: 693750 },
      { rate: 0.37, minIncome: 693750, maxIncome: undefined }
    ],
    [FilingStatus.MARRIED_SEPARATE]: [
      { rate: 0.10, minIncome: 0, maxIncome: 11000 },
      { rate: 0.12, minIncome: 11000, maxIncome: 44725 },
      { rate: 0.22, minIncome: 44725, maxIncome: 95375 },
      { rate: 0.24, minIncome: 95375, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 346875 },
      { rate: 0.37, minIncome: 346875, maxIncome: undefined }
    ],
    [FilingStatus.HEAD_OF_HOUSEHOLD]: [
      { rate: 0.10, minIncome: 0, maxIncome: 15700 },
      { rate: 0.12, minIncome: 15700, maxIncome: 59850 },
      { rate: 0.22, minIncome: 59850, maxIncome: 95350 },
      { rate: 0.24, minIncome: 95350, maxIncome: 182100 },
      { rate: 0.32, minIncome: 182100, maxIncome: 231250 },
      { rate: 0.35, minIncome: 231250, maxIncome: 578100 },
      { rate: 0.37, minIncome: 578100, maxIncome: undefined }
    ]
  }
};

export const STANDARD_DEDUCTIONS: Record<number, Record<FilingStatus, number>> = {
  2025: {
    [FilingStatus.SINGLE]: 14600,
    [FilingStatus.MARRIED_JOINT]: 29200,
    [FilingStatus.MARRIED_SEPARATE]: 14600,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: 21900
  },
  2024: {
    [FilingStatus.SINGLE]: 13850,
    [FilingStatus.MARRIED_JOINT]: 27700,
    [FilingStatus.MARRIED_SEPARATE]: 13850,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: 20800
  },
  2023: {
    [FilingStatus.SINGLE]: 13850,
    [FilingStatus.MARRIED_JOINT]: 27700,
    [FilingStatus.MARRIED_SEPARATE]: 13850,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: 20800
  }
};

export const AVAILABLE_TAX_YEARS = [2023, 2024, 2025];
export const DEFAULT_TAX_YEAR = 2025;

export const DEMO_TAX_CALCULATION_REQUEST: TaxCalculationRequest = {
  income: 75000,
  filingStatus: FilingStatus.SINGLE,
  deductions: 0,
  credits: 0,
  year: DEFAULT_TAX_YEAR
};

export const EMPTY_TAX_CALCULATION_REQUEST: TaxCalculationRequest = {
  income: 0,
  filingStatus: FilingStatus.SINGLE,
  deductions: 0,
  credits: 0,
  year: DEFAULT_TAX_YEAR
};

