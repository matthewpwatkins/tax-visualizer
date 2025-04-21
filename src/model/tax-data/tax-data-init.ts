import { TaxDataService, TaxYearData } from "./tax-year-data";

// Import tax data from JSON files
import taxData2023 from '../../data/2023.json';
import taxData2024 from '../../data/2024.json';
import taxData2025 from '../../data/2025.json';

// Initialize the tax data service with all available tax years
export function initializeTaxData(): void {
  const taxDataByYear: Record<number, TaxYearData> = {
    2023: taxData2023 as TaxYearData,
    2024: taxData2024 as TaxYearData,
    2025: taxData2025 as TaxYearData
  };
  
  TaxDataService.initialize(taxDataByYear);
}

// Initialize the tax data when this module is imported
initializeTaxData();