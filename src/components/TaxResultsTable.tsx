import React, { useState, useEffect, useCallback } from 'react';
import { formatCurrency, formatPercent, formatPercentPrecise } from '../utils/tax-utils';
import { BracketCalculation } from "../model/bracket-calculation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage, faDollarSign, faChartPie, faInfoCircle, faTag, faMoneyBillWave, faInfinity, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

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
  // Initialize expanded rows state - expand brackets that have income by default
  const initializeExpandedRows = useCallback(() => {
    const initialState: {[key: number]: boolean} = {};
    bracketCalculations.forEach((bracket, index) => {
      initialState[index] = bracket.incomeInBracket > 0;
    });
    return initialState;
  }, [bracketCalculations]);
  
  const [expandedRows, setExpandedRows] = useState<{[key: number]: boolean}>({});
  
  // Update expanded rows when bracket calculations change
  useEffect(() => {
    setExpandedRows(initializeExpandedRows());
  }, [initializeExpandedRows]);
  
  // Toggle expanded state
  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Calculate bracket fill percentage and remaining amount
  const getBracketVisualization = (bracket: BracketCalculation) => {
    // For the highest bracket with undefined max, we'll use a fixed amount above min for visualization
    const bracketWidth = bracket.max !== undefined 
      ? bracket.max - bracket.min 
      : Math.max(100000, bracket.incomeInBracket);
    
    // Calculate fill percentage
    const fillPercentage = Math.min(100, (bracket.incomeInBracket / bracketWidth) * 100);
    
    // Calculate tax portion of the progress bar (taxable percentage of the filled part)
    const taxFillPercentage = fillPercentage * (bracket.rate);
    
    // Calculate remaining amount in bracket
    const remainingInBracket = bracket.max !== undefined
      ? Math.max(0, bracket.max - bracket.min - bracket.incomeInBracket)
      : 0;
      
    return { fillPercentage, taxFillPercentage, remainingInBracket };
  };

  // Mobile card view for each bracket
  const renderMobileBracketCard = (bracket: BracketCalculation, index: number) => {
    const { fillPercentage, taxFillPercentage, remainingInBracket } = getBracketVisualization(bracket);
    const isLastBracket = index === bracketCalculations.length - 1;
    const isInBracket = bracket.incomeInBracket > 0;
    const isExpanded = expandedRows[index] || false;

    return (
      <div className="card mb-2" key={index}>
        <div 
          className="card-header d-flex justify-content-between align-items-center" 
          onClick={() => toggleRow(index)}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <span className="fw-bold">{formatPercent(bracket.rate)} Tax Rate</span>
            {isInBracket && (
              <span className="ms-2 badge bg-success">
                {formatCurrency(bracket.incomeInBracket)}
              </span>
            )}
          </div>
          <div>
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
          </div>
        </div>
        
        {isExpanded && (
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <div><FontAwesomeIcon icon={faTag} className="me-1" /> Bracket Range:</div>
              <div>
                {formatCurrency(bracket.min)} - {bracket.max !== undefined ? formatCurrency(bracket.max) : <FontAwesomeIcon icon={faInfinity} />}
              </div>
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div><FontAwesomeIcon icon={faInfoCircle} className="me-1" /> Bracket Fill:</div>
                <div>{Math.round(fillPercentage)}%</div>
              </div>
              {!isLastBracket && (
                <div className="progress" style={{ height: DISPLAY_CONSTANTS.MIN_PROGRESS_BAR_HEIGHT_MOBILE }}>
                  {isInBracket && (
                    <>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${fillPercentage - taxFillPercentage}%` }}
                        aria-valuenow={fillPercentage - taxFillPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                      <div 
                        className="progress-bar bg-danger" 
                        role="progressbar" 
                        style={{ width: `${taxFillPercentage}%` }}
                        aria-valuenow={taxFillPercentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Income in Bracket:</div>
              <div>{formatCurrency(bracket.incomeInBracket)}</div>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div><FontAwesomeIcon icon={faMoneyBillWave} className="me-1" /> Remaining:</div>
              <div>
                {!isInBracket ? (
                  <span className="text-muted">—</span>
                ) : fillPercentage === 100 && bracket.max !== undefined ? (
                  <span className="text-success fw-bold">{DISPLAY_CONSTANTS.FULL_TEXT}</span>
                ) : bracket.max !== undefined && remainingInBracket > 0 ? (
                  formatCurrency(remainingInBracket) + DISPLAY_CONSTANTS.LEFT_TEXT
                ) : (
                  <span><FontAwesomeIcon icon={faInfinity} /></span>
                )}
              </div>
            </div>
            
            <div className="d-flex justify-content-between">
              <div><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Tax in Bracket:</div>
              <div className={bracket.taxForBracket > 0 ? "text-danger" : ""}>
                {formatCurrency(bracket.taxForBracket)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      {/* Tax Bracket Breakdown */}
      <div className="card-header bg-success text-white">
        <h5 className="mb-0"><FontAwesomeIcon icon={faChartPie} className="me-2" /> Tax Breakdown by Bracket</h5>
      </div>
      
      {/* Mobile View */}
      <div className="d-block d-lg-none card-body">
        {bracketCalculations.map((bracket, index) => 
          renderMobileBracketCard(bracket, index)
        )}
      </div>
      
      {/* Desktop View */}
      <div className="d-none d-lg-block card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th><FontAwesomeIcon icon={faPercentage} className="me-1" /> Rate</th>
                <th><FontAwesomeIcon icon={faTag} className="me-1" /> Min</th>
                <th><FontAwesomeIcon icon={faTag} className="me-1" /> Max</th>
                <th style={{ width: '220px' }}><FontAwesomeIcon icon={faInfoCircle} className="me-1" /> Bracket Fill</th>
                <th><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Income in Bracket</th>
                <th><FontAwesomeIcon icon={faMoneyBillWave} className="me-1" /> Remaining in Bracket</th>
                <th><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Tax in Bracket</th>
              </tr>
            </thead>
            <tbody>
              {bracketCalculations.map((bracket, index) => {
                const { fillPercentage, taxFillPercentage, remainingInBracket } = getBracketVisualization(bracket);
                const isLastBracket = index === bracketCalculations.length - 1;
                const isInBracket = bracket.incomeInBracket > 0;
                
                return (
                  <tr key={index}>
                    <td>{formatPercent(bracket.rate)}</td>
                    <td>{formatCurrency(bracket.min)}</td>
                    <td>{bracket.max !== undefined ? formatCurrency(bracket.max) : <span style={{ fontSize: '1.25rem' }}><FontAwesomeIcon icon={faInfinity} /></span>}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="me-2" style={{ minWidth: DISPLAY_CONSTANTS.PERCENTAGE_WIDTH, textAlign: 'right' }}>
                          {isLastBracket && bracket.max === undefined ? (
                            <span className="text-dark"></span>
                          ) : (
                            <span className="text-dark">{Math.round(fillPercentage)}%</span>
                          )}
                        </div>
                        {!isLastBracket && (
                          <div className="progress flex-grow-1" style={{ height: DISPLAY_CONSTANTS.MIN_PROGRESS_BAR_HEIGHT }}>
                            {isInBracket && (
                              <>
                                <div 
                                  className="progress-bar bg-success" 
                                  role="progressbar" 
                                  style={{ width: `${fillPercentage - taxFillPercentage}%` }}
                                  aria-valuenow={fillPercentage - taxFillPercentage}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                                <div 
                                  className="progress-bar bg-danger" 
                                  role="progressbar" 
                                  style={{ width: `${taxFillPercentage}%` }}
                                  aria-valuenow={taxFillPercentage}
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                ></div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{formatCurrency(bracket.incomeInBracket)}</td>
                    <td>
                      {!isInBracket ? (
                        <span className="text-muted">—</span>
                      ) : fillPercentage === 100 && bracket.max !== undefined ? (
                        <span className="text-success fw-bold">{DISPLAY_CONSTANTS.FULL_TEXT}</span>
                      ) : bracket.max !== undefined && remainingInBracket > 0 ? (
                        formatCurrency(remainingInBracket) + DISPLAY_CONSTANTS.LEFT_TEXT
                      ) : (
                        <span style={{ fontSize: '1.25rem' }}><FontAwesomeIcon icon={faInfinity} /></span>
                      )}
                    </td>
                    <td className={bracket.taxForBracket > 0 ? "text-danger" : ""}>
                      {formatCurrency(bracket.taxForBracket)}
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

      {/* Summary section - make it responsive too */}
      <div className="card-body">
        <div className="px-2 py-2">
          <div className="d-flex justify-content-between border-bottom py-2 flex-wrap">
            <div className="fw-bold"><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Taxable Income:</div>
            <div className="fw-bold text-success">{formatCurrency(taxableIncome)}</div>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2 flex-wrap">
            <div className="fw-bold"><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Total Tax:</div>
            <div className="fw-bold text-danger">{formatCurrency(totalTax)}</div>
          </div>
          {credits > 0 && (
            <div className="d-flex justify-content-between border-bottom py-2 flex-wrap">
              <div className="fw-bold"><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Tax Credits:</div>
              <div className="fw-bold text-success">-{formatCurrency(credits)}</div>
            </div>
          )}
          <div className="d-flex justify-content-between border-bottom py-2 flex-wrap">
            <div className="fw-bold"><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Final Tax Amount:</div>
            <div className="fw-bold">{formatCurrency(taxAfterCredits)}</div>
          </div>
          <div className="d-flex justify-content-between py-2 flex-wrap">
            <div className="fw-bold"><FontAwesomeIcon icon={faPercentage} className="me-1" /> Effective Tax Rate:</div>
            <div className="fw-bold">{formatPercentPrecise(effectiveRate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxResultsTable;
// Tax bracket display constants

export const DISPLAY_CONSTANTS = {
  MIN_PROGRESS_BAR_HEIGHT: 24,
  MIN_PROGRESS_BAR_HEIGHT_MOBILE: 16, // Smaller height for mobile
  PERCENTAGE_WIDTH: 40,
  FULL_TEXT: 'Full',
  LEFT_TEXT: ' left'
};
