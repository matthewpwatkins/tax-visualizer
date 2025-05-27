import React from 'react';
import { formatCurrency, formatPercent, formatPercentPrecise } from '../utils/tax-utils';
import { BracketCalculation } from "../model/bracket-calculation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercentage, faDollarSign, faChartPie, faInfoCircle, faTag, faMoneyBillWave, faInfinity, faShareAlt } from '@fortawesome/free-solid-svg-icons';

interface TaxResultsTableProps {
  bracketCalculations: BracketCalculation[];
  taxableIncome: number;
  totalTax: number;
  taxAfterCredits: number;
  effectiveRate: number;
  credits: number;
  onShare?: () => void;
}

const TaxResultsTable: React.FC<TaxResultsTableProps> = ({
  bracketCalculations,
  taxableIncome,
  totalTax,
  taxAfterCredits,
  effectiveRate,
  credits,
  onShare
}) => {
  // Calculate the effective width of each bracket and the total span
  const bracketEffectiveWidths = bracketCalculations.map(bracket => {
    return bracket.max !== undefined
      ? bracket.max - bracket.min
      : Math.max(100000, bracket.incomeInBracket); // Representative width for the last "infinite" bracket
  });

  // Determine the maximum width of non-infinite brackets to use as a reference
  const finiteBracketEffectiveWidths = bracketCalculations
    .map((bracket, index) => (bracket.max !== undefined ? bracketEffectiveWidths[index] : 0))
    .filter(width => width > 0);

  let maxWidthReference = finiteBracketEffectiveWidths.length > 0 ? Math.max(...finiteBracketEffectiveWidths) : 0;

  // If no finite brackets exist or their max width is 0, fallback to the largest effective width of any bracket, or 100000
  if (maxWidthReference === 0) {
    maxWidthReference = bracketEffectiveWidths.length > 0 ? Math.max(...bracketEffectiveWidths) : 100000;
  }
  // Ensure maxWidthReference is at least 1 to prevent division by zero if all widths are 0 (highly unlikely)
  maxWidthReference = Math.max(1, maxWidthReference);

  // Calculate bracket fill percentage, tax portion, remaining amount, and relative progress bar width
  const getBracketVisualization = (bracket: BracketCalculation, individualEffectiveWidth: number, referenceWidth: number) => {
    // Calculate fill percentage based on income within this bracket's effective width
    const fillPercentage = individualEffectiveWidth > 0 ? Math.min(100, (bracket.incomeInBracket / individualEffectiveWidth) * 100) : 0;
    
    // Calculate tax portion of the progress bar (taxable percentage of the filled part)
    const taxFillPercentage = fillPercentage * bracket.rate;
    
    // Calculate remaining amount in bracket (uses actual bracket.max - bracket.min for text display)
    const remainingInBracket = bracket.max !== undefined
      ? Math.max(0, bracket.max - bracket.min - bracket.incomeInBracket)
      : 0;

    // Calculate the relative width of the progress bar container itself against the reference width
    const relativeProgressBarWidthPercentage = (individualEffectiveWidth / referenceWidth) * 100;
      
    return { fillPercentage, taxFillPercentage, remainingInBracket, relativeProgressBarWidthPercentage };
  };

  // Card view for each bracket - used for all screen sizes
  const renderBracketCard = (bracket: BracketCalculation, index: number) => {
    const individualEffectiveWidth = bracketEffectiveWidths[index];
    const vizDetails = getBracketVisualization(bracket, individualEffectiveWidth, maxWidthReference);
    const isLastBracket = index === bracketCalculations.length - 1;
    const isInBracket = bracket.incomeInBracket > 0;

    return (
      <div className="card mb-3" key={index}> {/* Increased bottom margin for better separation */}
        <div className="card-header">
          <span className="fw-bold">{formatPercent(bracket.rate)} Tax Rate</span>
          {isInBracket && (
            <span className="ms-2 badge bg-success">
              {formatCurrency(bracket.incomeInBracket)}
            </span>
          )}
        </div>
        
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <div><FontAwesomeIcon icon={faTag} className="me-1" /> Bracket Range:</div>
            <div>
              {formatCurrency(bracket.min)} - {bracket.max !== undefined ? formatCurrency(bracket.max) : <FontAwesomeIcon icon={faInfinity} />}
            </div>
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
              ) : vizDetails.fillPercentage === 100 && bracket.max !== undefined ? (
                <span className="text-success fw-bold">{DISPLAY_CONSTANTS.FULL_TEXT}</span>
              ) : bracket.max !== undefined && vizDetails.remainingInBracket > 0 ? (
                formatCurrency(vizDetails.remainingInBracket) + DISPLAY_CONSTANTS.LEFT_TEXT
              ) : (
                <span><FontAwesomeIcon icon={faInfinity} /></span>
              )}
            </div>
          </div>
          
          <div className="d-flex justify-content-between mb-3"> {/* Added mb-3 for spacing before fill */}
            <div><FontAwesomeIcon icon={faDollarSign} className="me-1" /> Tax in Bracket:</div>
            <div className={bracket.taxForBracket > 0 ? "text-danger" : ""}>
              {formatCurrency(bracket.taxForBracket)}
            </div>
          </div>
          {/* Bracket Fill percentage text remains in card-body */}
          {!isLastBracket && (
            <div className="d-flex justify-content-between align-items-center mt-2"> {/* mt-2 for spacing */}
              <div><FontAwesomeIcon icon={faInfoCircle} className="me-1" /> Bracket Fill:</div>
              <div>{Math.round(vizDetails.fillPercentage)}%</div>
            </div>
          )}
        </div>

        {/* Progress bar only in card-footer */}
        {!isLastBracket && (
          <div className="card-footer pt-2 pb-2"> {/* Adjusted padding for footer */}
            <div
              className="progress"
              style={{
                height: `${DISPLAY_CONSTANTS.MIN_PROGRESS_BAR_HEIGHT}px`, // Added 'px' unit
                width: `${vizDetails.relativeProgressBarWidthPercentage}%`
              }}
            >
              {isInBracket && (
                <>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${vizDetails.fillPercentage - vizDetails.taxFillPercentage}%` }}
                    aria-valuenow={vizDetails.fillPercentage - vizDetails.taxFillPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${vizDetails.taxFillPercentage}%` }}
                    aria-valuenow={vizDetails.taxFillPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      {/* Tax Bracket Breakdown */}
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0"><FontAwesomeIcon icon={faChartPie} className="me-2" /> Tax Breakdown by Bracket</h5>
        <div>
          {onShare && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onShare();
              }}
              className="btn btn-link text-white p-0 border-0 text-decoration-none"
              aria-label="Reset"
            >
              <FontAwesomeIcon icon={faShareAlt} className="me-1" /> Share
            </button>
          )}
        </div>
      </div>

      {/* Card View for all screen sizes */}
      <div className="card-body"> {/* Removed d-block d-lg-none to show on all screens */}
        {bracketCalculations.map((bracket, index) =>
          renderBracketCard(bracket, index) // Use the renamed function
        )}
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
  PERCENTAGE_WIDTH: 40,
  FULL_TEXT: 'Full',
  LEFT_TEXT: ' left'
};
