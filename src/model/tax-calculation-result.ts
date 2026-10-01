import { BracketCalculation } from "./bracket-calculation";

export interface TaxCalculationResult {
  taxableIncome: number;
  bracketCalculations: BracketCalculation[];
  totalTax: number;
  /** The part of the non-refundable credits that had tax left to cancel. */
  nonRefundableCreditsApplied: number;
  /** Non-refundable credits that went to waste because tax had already reached zero. */
  nonRefundableCreditsUnused: number;
  /** Negative when credits exceed the tax owed, which the filer receives as a refund. */
  taxAfterCredits: number;
}
