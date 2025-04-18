// Interface for bracket calculation results

export interface BracketCalculation {
  rate: number;
  min: number;
  max: number | undefined;
  incomeInBracket: number;
  taxForBracket: number;
}
