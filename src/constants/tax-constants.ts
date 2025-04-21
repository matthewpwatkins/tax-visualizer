import { TaxCalculationRequest } from "../model/tax-calculation-request";
import { FilingStatus } from "./filing-status";
import { TaxDataService } from "../model/tax-data/tax-year-data";
import "../model/tax-data/tax-data-init"; // Import to ensure tax data is initialized

// Export constants using TaxDataService
export const AVAILABLE_TAX_YEARS = TaxDataService.getAvailableYears();
export const DEFAULT_TAX_YEAR = TaxDataService.getDefaultYear();

// Get tax brackets for all years and filing statuses
export const TAX_BRACKETS = AVAILABLE_TAX_YEARS.reduce((brackets, year) => {
  brackets[year] = {
    [FilingStatus.SINGLE]: TaxDataService.getTaxBrackets(year, FilingStatus.SINGLE),
    [FilingStatus.MARRIED_JOINT]: TaxDataService.getTaxBrackets(year, FilingStatus.MARRIED_JOINT),
    [FilingStatus.MARRIED_SEPARATE]: TaxDataService.getTaxBrackets(year, FilingStatus.MARRIED_SEPARATE),
    [FilingStatus.HEAD_OF_HOUSEHOLD]: TaxDataService.getTaxBrackets(year, FilingStatus.HEAD_OF_HOUSEHOLD)
  };
  return brackets;
}, {} as Record<number, Record<FilingStatus, any>>);

// Get standard deductions for all years and filing statuses
export const STANDARD_DEDUCTIONS = AVAILABLE_TAX_YEARS.reduce((deductions, year) => {
  deductions[year] = {
    [FilingStatus.SINGLE]: TaxDataService.getStandardDeduction(year, FilingStatus.SINGLE),
    [FilingStatus.MARRIED_JOINT]: TaxDataService.getStandardDeduction(year, FilingStatus.MARRIED_JOINT),
    [FilingStatus.MARRIED_SEPARATE]: TaxDataService.getStandardDeduction(year, FilingStatus.MARRIED_SEPARATE),
    [FilingStatus.HEAD_OF_HOUSEHOLD]: TaxDataService.getStandardDeduction(year, FilingStatus.HEAD_OF_HOUSEHOLD)
  };
  return deductions;
}, {} as Record<number, Record<FilingStatus, number>>);

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

