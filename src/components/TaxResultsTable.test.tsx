import { render, screen } from '@testing-library/react';
import TaxResultsTable from './TaxResultsTable';
import { calculateTax } from '../utils/tax-utils';
import { FilingStatus } from '../constants/filing-status';

const renderFor = (nonRefundableCredits: number, refundableCredits: number) => {
  const result = calculateTax({
    income: 89000,
    filingStatus: FilingStatus.MARRIED_JOINT,
    deductions: 32200,
    nonRefundableCredits,
    refundableCredits,
    year: 2026
  });
  render(
    <TaxResultsTable
      bracketCalculations={result.bracketCalculations}
      taxableIncome={result.taxableIncome}
      totalTax={result.totalTax}
      nonRefundableCreditsApplied={result.nonRefundableCreditsApplied}
      nonRefundableCreditsUnused={result.nonRefundableCreditsUnused}
      refundableCredits={refundableCredits}
      taxAfterCredits={result.taxAfterCredits}
      effectiveRate={result.taxAfterCredits / 89000}
    />
  );
};

test('shows a refund instead of an amount owed when credits overshoot', () => {
  renderFor(4 * 500, 4 * 1700);
  const refundRow = screen.getByText(/Refund:/).closest('div')?.parentElement;
  // The 10% bracket also owes $2,480, so the amount has to be read off the refund row itself
  expect(refundRow).toHaveTextContent('$2,480.00');
  expect(screen.queryByText(/Final Tax Amount:/)).toBeNull();
});

test('shows an amount owed when tax remains', () => {
  renderFor(0, 0);
  expect(screen.getByText(/Final Tax Amount:/)).toBeInTheDocument();
  expect(screen.queryByText(/Refund:/)).toBeNull();
});

test('calls out non-refundable credits that had no tax left to cancel', () => {
  renderFor(10000, 0);
  expect(screen.getByText(/unused/)).toBeInTheDocument();
  expect(screen.getByText(/\$3,680\.00 unused/)).toBeInTheDocument();
});
