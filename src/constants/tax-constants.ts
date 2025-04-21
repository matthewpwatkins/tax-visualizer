import { TaxCalculationRequest } from "../model/tax-calculation-request";
import { FilingStatus } from "./filing-status";
import { TaxBracket } from "./tax-bracket";

// Import tax data from JSON files
import taxData2023 from '../data/2023.json';
import taxData2024 from '../data/2024.json';
import taxData2025 from '../data/2025.json';

// Helper function to convert JSON tax brackets to TaxBracket[] format
// This handles the null -> undefined conversion properly
const convertJsonBrackets = (brackets: any[]): TaxBracket[] => {
  return brackets.map(bracket => ({
    rate: bracket.rate,
    minIncome: bracket.minIncome,
    maxIncome: bracket.maxIncome === null ? undefined : bracket.maxIncome
  }));
};

// Create a record of all tax data by year
const taxDataByYear = {
  2023: taxData2023,
  2024: taxData2024,
  2025: taxData2025
};

// Convert the JSON data into the expected format for TAX_BRACKETS
export const TAX_BRACKETS: Record<number, Record<FilingStatus, TaxBracket[]>> = {
  2023: {
    [FilingStatus.SINGLE]: convertJsonBrackets(taxData2023.taxBrackets.single),
    [FilingStatus.MARRIED_JOINT]: convertJsonBrackets(taxData2023.taxBrackets.marriedJoint),
    [FilingStatus.MARRIED_SEPARATE]: convertJsonBrackets(taxData2023.taxBrackets.marriedSeparate),
    [FilingStatus.HEAD_OF_HOUSEHOLD]: convertJsonBrackets(taxData2023.taxBrackets.headOfHousehold)
  },
  2024: {
    [FilingStatus.SINGLE]: convertJsonBrackets(taxData2024.taxBrackets.single),
    [FilingStatus.MARRIED_JOINT]: convertJsonBrackets(taxData2024.taxBrackets.marriedJoint),
    [FilingStatus.MARRIED_SEPARATE]: convertJsonBrackets(taxData2024.taxBrackets.marriedSeparate),
    [FilingStatus.HEAD_OF_HOUSEHOLD]: convertJsonBrackets(taxData2024.taxBrackets.headOfHousehold)
  },
  2025: {
    [FilingStatus.SINGLE]: convertJsonBrackets(taxData2025.taxBrackets.single),
    [FilingStatus.MARRIED_JOINT]: convertJsonBrackets(taxData2025.taxBrackets.marriedJoint),
    [FilingStatus.MARRIED_SEPARATE]: convertJsonBrackets(taxData2025.taxBrackets.marriedSeparate),
    [FilingStatus.HEAD_OF_HOUSEHOLD]: convertJsonBrackets(taxData2025.taxBrackets.headOfHousehold)
  }
};

// Convert the JSON data into the expected format for STANDARD_DEDUCTIONS
export const STANDARD_DEDUCTIONS: Record<number, Record<FilingStatus, number>> = {
  2023: {
    [FilingStatus.SINGLE]: taxData2023.standardDeductions.single,
    [FilingStatus.MARRIED_JOINT]: taxData2023.standardDeductions.marriedJoint,
    [FilingStatus.MARRIED_SEPARATE]: taxData2023.standardDeductions.marriedSeparate,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: taxData2023.standardDeductions.headOfHousehold
  },
  2024: {
    [FilingStatus.SINGLE]: taxData2024.standardDeductions.single,
    [FilingStatus.MARRIED_JOINT]: taxData2024.standardDeductions.marriedJoint,
    [FilingStatus.MARRIED_SEPARATE]: taxData2024.standardDeductions.marriedSeparate,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: taxData2024.standardDeductions.headOfHousehold
  },
  2025: {
    [FilingStatus.SINGLE]: taxData2025.standardDeductions.single,
    [FilingStatus.MARRIED_JOINT]: taxData2025.standardDeductions.marriedJoint,
    [FilingStatus.MARRIED_SEPARATE]: taxData2025.standardDeductions.marriedSeparate,
    [FilingStatus.HEAD_OF_HOUSEHOLD]: taxData2025.standardDeductions.headOfHousehold
  }
};

export const AVAILABLE_TAX_YEARS = Object.keys(taxDataByYear).map(Number);
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

