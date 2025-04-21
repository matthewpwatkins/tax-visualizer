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
import { 
  faCalculator, 
  faDollarSign, 
  faCalendar, 
  faUserFriends, 
  faReceipt, 
  faPiggyBank, 
  faUndo 
} from '@fortawesome/free-solid-svg-icons';
import { TaxCalculationRequest } from '../model/tax-calculation-request';

interface TaxFormProps {
  onSubmit: (config: TaxCalculationRequest) => void;
  initialConfig?: TaxCalculationRequest;
  urlChecked: boolean;
  onReset?: () => void;
}

const TaxForm: React.FC<TaxFormProps> = ({ 
  onSubmit, 
  initialConfig, 
  urlChecked,
  onReset 
}) => {
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
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0"><FontAwesomeIcon icon={faCalculator} className="me-2" /> Tax Calculator</h5>
        <div>
          {onReset && (
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onReset();
              }}
              className="text-white text-decoration-none"
              aria-label="Reset"
            >
              <FontAwesomeIcon icon={faUndo} className="me-1" /> Reset
            </a>
          )}
        </div>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Income */}
          <div className="mb-3">
            <label htmlFor="income" className="form-label">
              <FontAwesomeIcon icon={faDollarSign} className="me-1" /> Annual Income
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
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
          </div>
          
          {/* Filing Status */}
          <div className="mb-3">
            <label htmlFor="filingStatus" className="form-label">
              <FontAwesomeIcon icon={faUserFriends} className="me-1" /> Filing Status
            </label>
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

          {/* Tax Year */}
          <div className="mb-3">
            <label htmlFor="year" className="form-label">
              <FontAwesomeIcon icon={faCalendar} className="me-1" /> Tax Year
            </label>
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

          {/* Deductions */}
          <div className="mb-3">
            <label htmlFor="deductions" className="form-label">
              <FontAwesomeIcon icon={faReceipt} className="me-1" /> Deductions
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
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
            </div>
            <div className="form-text small">
              Standard deduction for {config.filingStatus.replace(/([A-Z])/g, ' $1').toLowerCase()} in {config.year}: ${standardDeduction.toLocaleString('en-US')}
            </div>
          </div>
          
          {/* Tax Credits */}
          <div className="mb-4">
            <label htmlFor="credits" className="form-label">
              <FontAwesomeIcon icon={faPiggyBank} className="me-1" /> Tax Credits
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
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

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <FontAwesomeIcon icon={faCalculator} className="me-2" /> Calculate Tax
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxForm;