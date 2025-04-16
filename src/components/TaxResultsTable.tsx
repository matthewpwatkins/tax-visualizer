import React from 'react';
import { BracketCalculation, formatCurrency, formatPercent, DISPLAY_CONSTANTS } from '../utils/taxUtils';

interface TaxResultsTableProps {
  bracketCalculations: BracketCalculation[];
  taxableIncome: number;
  totalTax: number;
  taxAfterCredits: number;
  effectiveRate: number;
  credits: number;
}

const TaxResultsTable: React.FC<TaxResultsTableProps> = ({
  bracketCalculations,
  taxableIncome,
  totalTax,
  taxAfterCredits,
  effectiveRate,
  credits
}) => {
  
  // Calculate bracket fill percentage and remaining amount
  const getBracketVisualization = (bracket: BracketCalculation) => {
    // For the highest bracket with null max, we'll use a fixed amount above min for visualization
    const bracketWidth = bracket.max !== null 
      ? bracket.max - bracket.min 
      : Math.max(100000, bracket.incomeInBracket);
    
    // Calculate fill percentage
    const fillPercentage = Math.min(100, (bracket.incomeInBracket / bracketWidth) * 100);
    
    // Calculate remaining amount in bracket
    const remainingInBracket = bracket.max !== null
      ? Math.max(0, bracket.max - bracket.min - bracket.incomeInBracket)
      : 0;
      
    return { fillPercentage, remainingInBracket };
  };

  return (
    <div className="card">
      {/* Tax Bracket Breakdown */}
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">Tax Breakdown by Bracket</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Tax Bracket</th>
                <th>Rate</th>
                <th style={{ width: '220px' }}>Bracket Fill</th>
                <th>Income in Bracket</th>
                <th>Tax in Bracket</th>
                <th>Remaining in Bracket</th>
              </tr>
            </thead>
            <tbody>
              {bracketCalculations.map((bracket, index) => {
                const { fillPercentage, remainingInBracket } = getBracketVisualization(bracket);
                const isLastBracket = index === bracketCalculations.length - 1;
                
                return (
                  <tr key={index}>
                    <td>
                      {formatCurrency(bracket.min)} - {bracket.max !== null ? formatCurrency(bracket.max) : 'and up'}
                    </td>
                    <td>{formatPercent(bracket.rate)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2" style={{ minWidth: DISPLAY_CONSTANTS.PERCENTAGE_WIDTH, textAlign: 'right' }}>
                          {isLastBracket && bracket.max === null ? (
                            <span className="text-dark"></span>
                          ) : (
                            <span className="text-dark">{Math.round(fillPercentage)}%</span>
                          )}
                        </div>
                        {!isLastBracket && (
                          <div className="progress flex-grow-1" style={{ height: DISPLAY_CONSTANTS.MIN_PROGRESS_BAR_HEIGHT }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${fillPercentage}%` }}
                              aria-valuenow={fillPercentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{formatCurrency(bracket.incomeInBracket)}</td>
                    <td>{formatCurrency(bracket.taxForBracket)}</td>
                    <td>
                      {fillPercentage === 100 && bracket.max !== null ? (
                        <span className="text-success fw-bold">{DISPLAY_CONSTANTS.FULL_TEXT}</span>
                      ) : bracket.max !== null && remainingInBracket > 0 ? (
                        formatCurrency(remainingInBracket) + DISPLAY_CONSTANTS.LEFT_TEXT
                      ) : (
                        <span style={{ fontSize: '1.25rem' }}>∞</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Horizontal divider between tables */}
      <hr className="mx-3 my-0" />

      {/* Summary section */}
      <div className="card-body">
        <div className="px-2 py-2">
          <div className="d-flex justify-content-between border-bottom py-2">
            <div className="fw-bold">Taxable Income:</div>
            <div className="fw-bold text-success">{formatCurrency(taxableIncome)}</div>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2">
            <div className="fw-bold">Total Tax:</div>
            <div className="fw-bold text-danger">{formatCurrency(totalTax)}</div>
          </div>
          {credits > 0 && (
            <div className="d-flex justify-content-between border-bottom py-2">
              <div className="fw-bold">Tax Credits:</div>
              <div className="fw-bold text-success">-{formatCurrency(credits)}</div>
            </div>
          )}
          <div className="d-flex justify-content-between border-bottom py-2">
            <div className="fw-bold">Final Tax Amount:</div>
            <div className="fw-bold">{formatCurrency(taxAfterCredits)}</div>
          </div>
          <div className="d-flex justify-content-between py-2">
            <div className="fw-bold">Effective Tax Rate:</div>
            <div className="fw-bold">{formatPercent(effectiveRate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxResultsTable;