import { FilingStatus } from "../../constants/filing-status";
import { TaxBracket } from "../../constants/tax-bracket";

/**
 * Represents the structure of a tax year data file
 */
export interface TaxYearData {
  taxBrackets: {
    single: TaxBracketData[];
    marriedJoint: TaxBracketData[];
    marriedSeparate: TaxBracketData[];
    headOfHousehold: TaxBracketData[];
  };
  standardDeductions: {
    single: number;
    marriedJoint: number;
    marriedSeparate: number;
    headOfHousehold: number;
  };
}

/**
 * Represents a single tax bracket in the JSON data
 */
export interface TaxBracketData {
  rate: number;
  minIncome: number;
  maxIncome: number | null;
}

/**
 * Service class for accessing tax data
 */
export class TaxDataService {
  private static taxDataCache: Record<number, TaxYearData> = {};
  private static availableYears: number[] = [];

  /**
   * Initializes the tax data service with data for multiple years
   */
  public static initialize(taxData: Record<number, TaxYearData>): void {
    TaxDataService.taxDataCache = taxData;
    TaxDataService.availableYears = Object.keys(taxData).map(Number).sort();
  }

  /**
   * Gets all available tax years
   */
  public static getAvailableYears(): number[] {
    return [...TaxDataService.availableYears];
  }

  /**
   * Gets the most recent tax year
   */
  public static getDefaultYear(): number {
    return Math.max(...TaxDataService.availableYears);
  }

  /**
   * Gets the tax brackets for a specific year and filing status
   */
  public static getTaxBrackets(year: number, filingStatus: FilingStatus): TaxBracket[] {
    const yearData = TaxDataService.taxDataCache[year];
    if (!yearData) {
      throw new Error(`No tax data available for year ${year}`);
    }
    
    // Map the JSON data structure to the application's TaxBracket interface
    let brackets: TaxBracketData[];
    switch (filingStatus) {
      case FilingStatus.SINGLE:
        brackets = yearData.taxBrackets.single;
        break;
      case FilingStatus.MARRIED_JOINT:
        brackets = yearData.taxBrackets.marriedJoint;
        break;
      case FilingStatus.MARRIED_SEPARATE:
        brackets = yearData.taxBrackets.marriedSeparate;
        break;
      case FilingStatus.HEAD_OF_HOUSEHOLD:
        brackets = yearData.taxBrackets.headOfHousehold;
        break;
      default:
        throw new Error(`Invalid filing status: ${filingStatus}`);
    }

    // Convert null maxIncome to undefined (for the highest bracket)
    return brackets.map(bracket => ({
      rate: bracket.rate,
      minIncome: bracket.minIncome,
      maxIncome: bracket.maxIncome === null ? undefined : bracket.maxIncome
    }));
  }

  /**
   * Gets the standard deduction for a specific year and filing status
   */
  public static getStandardDeduction(year: number, filingStatus: FilingStatus): number {
    const yearData = TaxDataService.taxDataCache[year];
    if (!yearData) {
      throw new Error(`No tax data available for year ${year}`);
    }
    
    switch (filingStatus) {
      case FilingStatus.SINGLE:
        return yearData.standardDeductions.single;
      case FilingStatus.MARRIED_JOINT:
        return yearData.standardDeductions.marriedJoint;
      case FilingStatus.MARRIED_SEPARATE:
        return yearData.standardDeductions.marriedSeparate;
      case FilingStatus.HEAD_OF_HOUSEHOLD:
        return yearData.standardDeductions.headOfHousehold;
      default:
        throw new Error(`Invalid filing status: ${filingStatus}`);
    }
  }
}