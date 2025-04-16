import React, { useState, useEffect } from 'react';
import { 
  FilingStatus, 
  FilingStatusEnum, 
  getStandardDeduction, 
  AVAILABLE_TAX_YEARS,
  DEFAULT_TAX_YEAR,
  TaxConfig
} from '../utils/taxUtils';
import { NumericFormat } from 'react-number-format';

interface TaxFormProps {
  onSubmit: (config: TaxConfig) => void;
  initialConfig?: TaxConfig;
}

const TaxForm: React.FC<TaxFormProps> = ({ onSubmit, initialConfig }) => {
  // Initialize form with default config or provided initial config
  const [config, setConfig] = useState<TaxConfig>(
    initialConfig || new TaxConfig()
  );

  const [standardDeduction, setStandardDeduction] = useState<number>(
    getStandardDeduction(config.filingStatus, config.year)
  );

  // Update standard deduction when filing status or year changes
  useEffect(() => {
    const newStandardDeduction = getStandardDeduction(config.filingStatus, config.year);
    setStandardDeduction(newStandardDeduction);
    
    // If current deduction is less than the standard, update to the standard
    if (config.deductions < newStandardDeduction) {
      updateConfig({ deductions: newStandardDeduction });
    }
  }, [config.filingStatus, config.year]);

  // Helper function to update config while preserving class instance
  const updateConfig = (updates: Partial<TaxConfig>) => {
    setConfig(new TaxConfig({
      ...config,
      ...updates
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'filingStatus') {
      updateConfig({ filingStatus: value as FilingStatus });
    } else if (name === 'year') {
      updateConfig({ year: Number(value) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Enter Your Tax Information</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="income" className="form-label">Annual Income ($)</label>
              <NumericFormat
                className="form-control"
                id="income"
                name="income"
                value={config.income}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  updateConfig({ income: floatValue || 0 });
                }}
                thousandSeparator=","
                decimalScale={2}
                allowNegative={false}
                placeholder="Enter income"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label htmlFor="filingStatus" className="form-label">Filing Status</label>
              <select
                className="form-select"
                id="filingStatus"
                name="filingStatus"
                value={config.filingStatus}
                onChange={handleChange}
                required
              >
                <option value={FilingStatusEnum.SINGLE}>Single</option>
                <option value={FilingStatusEnum.MARRIED_JOINT}>Married Filing Jointly</option>
                <option value={FilingStatusEnum.MARRIED_SEPARATE}>Married Filing Separately</option>
                <option value={FilingStatusEnum.HEAD_OF_HOUSEHOLD}>Head of Household</option>
              </select>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="deductions" className="form-label">Deductions ($)</label>
              <NumericFormat
                className="form-control"
                id="deductions"
                name="deductions"
                value={config.deductions}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  // Ensure deductions are not less than standard deduction
                  const deductionValue = Math.max(floatValue || 0, standardDeduction);
                  updateConfig({ deductions: deductionValue });
                }}
                thousandSeparator=","
                decimalScale={2}
                allowNegative={false}
                min={standardDeduction}
                placeholder="Enter deductions"
                required
              />
              <div className="form-text">
                Standard deduction for {config.filingStatus.replace(/([A-Z])/g, ' $1').toLowerCase()} in {config.year}: ${standardDeduction.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="credits" className="form-label">Tax Credits ($)</label>
              <NumericFormat
                className="form-control"
                id="credits"
                name="credits"
                value={config.credits}
                onValueChange={(values) => {
                  const { floatValue } = values;
                  updateConfig({ credits: floatValue || 0 });
                }}
                thousandSeparator=","
                decimalScale={2}
                allowNegative={false}
                placeholder="Enter credits"
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label htmlFor="year" className="form-label">Tax Year</label>
              <select
                className="form-select"
                id="year"
                name="year"
                value={config.year}
                onChange={handleChange}
                required
              >
                {AVAILABLE_TAX_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Calculate Tax
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;