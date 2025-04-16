import React, { useState, useEffect } from 'react';
import './App.css';
import TaxForm from './components/TaxForm';
import TaxResultsTable from './components/TaxResultsTable';
import { calculateTax, TaxConfig } from './utils/taxUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [taxResults, setTaxResults] = useState<{
    taxableIncome: number;
    bracketCalculations: any[];
    totalTax: number;
    taxAfterCredits: number;
    effectiveRate: number;
    credits: number;
  } | null>(null);

  // Store initial config from query parameters
  const [initialConfig, setInitialConfig] = useState<TaxConfig | undefined>(undefined);

  useEffect(() => {
    // Parse query parameters when the component mounts
    const searchParams = new URLSearchParams(window.location.search);
    
    // If we have query parameters, create a config and calculate tax immediately
    if (searchParams.toString()) {
      const config = TaxConfig.fromSearchParams(searchParams);
      
      if (config.validate()) {
        setInitialConfig(config);
        handleConfigSubmit(config);
      }
    }
  }, []);

  const handleConfigSubmit = (config: TaxConfig) => {
    // Update URL with query parameters
    config.updateUrl();
    
    // Calculate tax based on config
    const { income, filingStatus, deductions, credits, year } = config;
    const results = calculateTax(income, filingStatus, deductions, credits, year);
    
    // Calculate effective tax rate
    const effectiveRate = results.taxAfterCredits / income;
    
    setTaxResults({
      ...results,
      effectiveRate,
      credits
    });
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
            <TaxForm 
              onSubmit={handleConfigSubmit} 
              initialConfig={initialConfig}
            />
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
