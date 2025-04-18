import React, { useState, useEffect, useCallback } from 'react';
import { FilingStatus } from "../constants/filing-status";
import { 
  AVAILABLE_TAX_YEARS, 
  DEMO_TAX_CALCULATION_REQUEST, 
  EMPTY_TAX_CALCULATION_REQUEST,
  STANDARD_DEDUCTIONS 
} from "../constants/tax-constants";
import { NumericFormat } from 'react-number-format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';
import { TaxCalculationRequest } from '../model/tax-calculation-request';

interface TaxFormProps {
  onSubmit: (config: TaxCalculationRequest) => void;
  initialConfig?: TaxCalculationRequest;
  urlChecked: boolean;
}

const TaxForm: React.FC<TaxFormProps> = ({ onSubmit, initialConfig, urlChecked }) => {
  // Initialize form state based on props
  const getInitialState = useCallback(() => {
    if (initialConfig) {
      return { ...initialConfig };
    }
    
    return urlChecked 
      ? { ...DEMO_TAX_CALCULATION_REQUEST }
      : { ...EMPTY_TAX_CALCULATION_REQUEST };
  }, [initialConfig, urlChecked]);

  const [config, setConfig] = useState<TaxCalculationRequest>(getInitialState);

  // Update form when initialConfig changes (URL params)
  useEffect(() => {
    if (initialConfig) {
      setConfig({ ...initialConfig });
    }
  }, [initialConfig]);
  
  // Get current standard deduction
  const standardDeduction = STANDARD_DEDUCTIONS[config.year][config.filingStatus];
  
  // Ensure deductions meet minimum standard deduction
  useEffect(() => {
    if (config.deductions < standardDeduction) {
      setConfig(prev => ({
        ...prev,
        deductions: standardDeduction
      }));
    }
  }, [config.filingStatus, config.year, config.deductions, standardDeduction]);
  
  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      ...config,
      deductions: Math.max(config.deductions, standardDeduction)
    });
  };
  
  // Handle changes to filing status and year
  const handleStatusOrYearChange = (name: string, value: string | number) => {
    const newValue = name === "year" ? Number(value) : value;
    const newConfig = { ...config, [name]: newValue };
    
    // Calculate new standard deduction
    const newStandardDeduction = name === "year" 
      ? STANDARD_DEDUCTIONS[Number(value)][config.filingStatus]
      : STANDARD_DEDUCTIONS[config.year][value as FilingStatus];
    
    // Update config with minimum deduction value
    newConfig.deductions = Math.max(config.deductions, newStandardDeduction);
    setConfig(newConfig);
  };
  
  // Form field change handler
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "year" || name === "filingStatus") {
      handleStatusOrYearChange(name, value);
    } else {
      setConfig({
        ...config,
        [name]: name === "income" || name === "deductions" || name === "credits" 
          ? Number(value) 
          : value
      });
    }
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
                  setConfig({
                    ...config,
                    income: values.floatValue || 0
                  });
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
                <option value={FilingStatus.SINGLE}>Single</option>
                <option value={FilingStatus.MARRIED_JOINT}>Married Filing Jointly</option>
                <option value={FilingStatus.MARRIED_SEPARATE}>Married Filing Separately</option>
                <option value={FilingStatus.HEAD_OF_HOUSEHOLD}>Head of Household</option>
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
                value={Math.max(config.deductions, standardDeduction)}
                onValueChange={(values) => {
                  setConfig({
                    ...config,
                    deductions: Math.max(values.floatValue || 0, standardDeduction)
                  });
                }}
                thousandSeparator=","
                decimalScale={2}
                allowNegative={false}
                placeholder="Enter deductions"
                required
              />
              <div className="form-text">
                Standard deduction for {config.filingStatus.replace(/([A-Z])/g, ' $1').toLowerCase()} in {config.year}: ${standardDeduction.toLocaleString('en-US')}
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
                  setConfig({
                    ...config,
                    credits: values.floatValue || 0
                  });
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
            <FontAwesomeIcon icon={faCalculator} /> Calculate Tax
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;