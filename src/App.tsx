import { useEffect } from 'react';
import './App.css';
import TaxForm from './components/TaxForm';
import TaxResultsTable from './components/TaxResultsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useTaxParams } from './hooks/useTaxParams';
import { useTaxCalculation } from './hooks/useTaxCalculation';
import { TaxCalculationRequest } from './model/tax-calculation-request';

function App() {
  // Use custom hooks for URL parameters and tax calculations
  const { initialConfig, urlChecked, updateUrlWithConfig } = useTaxParams();
  const { taxResults, calculateTaxes } = useTaxCalculation();

  // Calculate taxes when initialConfig is available
  useEffect(() => {
    if (initialConfig) {
      calculateTaxes(initialConfig);
    }
  }, [initialConfig, calculateTaxes]);

  // Handler for form submission
  const handleConfigSubmit = (config: TaxCalculationRequest) => {
    // Update URL and calculate taxes
    updateUrlWithConfig(config);
    calculateTaxes(config);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">Tax Visualizer</span>
          <div className="navbar-nav ms-auto">
            <a href="https://github.com/matthewpwatkins/tax-visualizer" 
               className="nav-link text-white" 
               target="_blank" 
               rel="noopener noreferrer" 
               aria-label="GitHub Repository">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
            <a href="https://watkins.dev" 
               className="nav-link text-white" 
               target="_blank" 
               rel="noopener noreferrer" 
               aria-label="Developer's Website">
              <FontAwesomeIcon icon={faGlobe} /> watkins.dev
            </a>
          </div>
        </div>
      </nav>

      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col-12 text-center mb-4">
            <h1 className="display-4 fw-bold text-primary">Tax Visualizer</h1>
            <p className="lead">See how your income tax is calculated across different brackets</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-12">
            {urlChecked && (
              <TaxForm 
                onSubmit={handleConfigSubmit} 
                initialConfig={initialConfig}
                urlChecked={urlChecked}
              />
            )}
          </div>
        </div>
        
        {taxResults && (
          <div className="row mt-4">
            <div className="col-lg-12">
              <TaxResultsTable 
                bracketCalculations={taxResults.bracketCalculations}
                taxableIncome={taxResults.taxableIncome}
                totalTax={taxResults.totalTax}
                taxAfterCredits={taxResults.taxAfterCredits}
                effectiveRate={taxResults.effectiveRate}
                credits={taxResults.credits}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
