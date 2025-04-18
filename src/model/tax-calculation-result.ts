import { BracketCalculation } from "./bracket-calculation";

export interface TaxCalculationResult {
  taxableIncome: number;
  bracketCalculations: BracketCalculation[];
  totalTax: number;
  taxAfterCredits: number;
}
