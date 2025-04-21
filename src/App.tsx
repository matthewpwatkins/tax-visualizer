import { useEffect, useState, useRef } from 'react';
import './App.css';
import TaxForm from './components/TaxForm';
import TaxResultsTable from './components/TaxResultsTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faBars, faChartLine, faInfoCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useTaxParams } from './hooks/useTaxParams';
import { useTaxCalculation } from './hooks/useTaxCalculation';
import { TaxCalculationRequest } from './model/tax-calculation-request';
// Import Bootstrap's Toast constructor
import { Toast } from 'bootstrap';

function App() {
  // Use custom hooks for URL parameters and tax calculations
  const { initialConfig, urlChecked, updateUrlWithConfig } = useTaxParams();
  const { taxResults, calculateTaxes } = useTaxCalculation();
  const toastRef = useRef<HTMLDivElement>(null);
  
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
    
    // Show Bootstrap toast
    if (toastRef.current) {
      const toast = new Toast(toastRef.current, {
        autohide: true,
        delay: 10000 // 10 seconds
      });
      toast.show();
    }
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
              <a
                href="https://github.com/matthewpwatkins/tax-visualizer"
                className="nav-link text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <FontAwesomeIcon icon={faGithub} className="me-1" /> GitHub
              </a>
              <a
                href="https://watkins.dev"
                className="nav-link text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer's Website"
              >
                <FontAwesomeIcon icon={faGlobe} className="me-1" /> watkins.dev
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Bootstrap Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div 
          className="toast align-items-center text-white bg-success border-0" 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          ref={toastRef}
        >
          <div className="d-flex">
            <div className="toast-body">
              <FontAwesomeIcon icon={faCheck} className="me-2" />
              Link copied to clipboard. Share it with anyone you want.
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              data-bs-dismiss="toast" 
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

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
                // Only pass the reset handler to the form
                onReset={taxResults ? handleReset : undefined}
              />
            )}
          </div>
        </div>
        
        {taxResults && (
          <div className="row mt-0 mt-md-2" id="tax-results">
            <div className="col-12">
              <TaxResultsTable 
                bracketCalculations={taxResults.bracketCalculations}
                taxableIncome={taxResults.taxableIncome}
                totalTax={taxResults.totalTax}
                taxAfterCredits={taxResults.taxAfterCredits}
                effectiveRate={taxResults.effectiveRate}
                credits={taxResults.credits}
                // Pass the share handler to the tax results table
                onShare={handleShare}
              />
            </div>
          </div>
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
