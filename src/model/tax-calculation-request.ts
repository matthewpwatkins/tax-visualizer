import { FilingStatus } from "../constants/filing-status";

export interface TaxCalculationRequest {
  income: number;
  filingStatus: FilingStatus;
  deductions: number;
  /** Credits that can reduce tax to zero but no further, such as the child and dependent care credit. */
  nonRefundableCredits: number;
  /** Credits that are paid out even when no tax is owed, such as the additional child tax credit. */
  refundableCredits: number;
  year: number;
}
