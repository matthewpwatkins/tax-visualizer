import { useEffect, useState } from 'react';
import './App.css';
import TaxForm from './components/TaxForm';
import TaxResultsTable from './components/TaxResultsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faBars, faChartLine, faInfoCircle, faShareAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { useTaxParams } from './hooks/useTaxParams';
import { useTaxCalculation } from './hooks/useTaxCalculation';
import { TaxCalculationRequest } from './model/tax-calculation-request';

function App() {
  // Use custom hooks for URL parameters and tax calculations
  const { initialConfig, urlChecked, updateUrlWithConfig } = useTaxParams();
  const { taxResults, calculateTaxes } = useTaxCalculation();
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  
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

  // Function to copy current URL to clipboard
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopyMessage(true);
    setTimeout(() => {
      setShowCopyMessage(false);
    }, 2000);
  };

  // Function to reset the form
  const handleReset = () => {
    window.history.pushState({}, '', window.location.pathname);
    window.location.reload();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand">
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Tax Visualizer
          </span>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <a href="https://github.com/matthewpwatkins/tax-visualizer" 
                className="nav-link text-white" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub Repository">
                <FontAwesomeIcon icon={faGithub} className="me-1" /> GitHub
              </a>
              <a href="https://watkins.dev" 
                className="nav-link text-white" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Developer's Website">
                <FontAwesomeIcon icon={faGlobe} className="me-1" /> watkins.dev
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container my-3 my-md-4 flex-grow-1">
        <div className="row">
          <div className="col-12 text-center mb-3 mb-md-4">
            <h1 className="display-5 fw-bold text-primary">Tax Visualizer</h1>
            <p className="lead">See how your income tax is calculated across different brackets</p>
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
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
          <>
            {showCopyMessage && (
              <div className="row mt-3">
                <div className="col-12">
                  <div className="alert alert-success" role="alert">
                    Link copied to clipboard!
                  </div>
                </div>
              </div>
            )}
            <div className="row mt-3">
              <div className="col-12 mb-3">
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-outline-primary" 
                    onClick={handleShare}
                    aria-label="Share"
                  >
                    <FontAwesomeIcon icon={faShareAlt} className="me-1" /> Share
                  </button>
                  <button 
                    className="btn btn-outline-secondary" 
                    onClick={handleReset}
                    aria-label="Reset"
                  >
                    <FontAwesomeIcon icon={faUndo} className="me-1" /> Reset
                  </button>
                </div>
              </div>
            </div>
            <div className="row mt-0 mt-md-2" id="tax-results">
              <div className="col-12">
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
          </>
        )}
      </div>

      <footer className="bg-light py-3 mt-auto border-top">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-2 mb-md-0">
              <small className="text-muted">
                <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                This calculator is for educational purposes only.
              </small>
            </div>
            <div>
              <small className="text-muted">
                © {new Date().getFullYear()} Tax Visualizer
              </small>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
