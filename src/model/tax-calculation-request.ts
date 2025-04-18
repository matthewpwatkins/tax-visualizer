import { FilingStatus } from "../constants/filing-status";

export interface TaxCalculationRequest {
  income: number;
  filingStatus: FilingStatus;
  deductions: number;
  credits: number;
  year: number;
}
