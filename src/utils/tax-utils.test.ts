import { FilingStatus } from '../constants/filing-status';
import { AVAILABLE_TAX_YEARS, DEFAULT_TAX_YEAR, STANDARD_DEDUCTIONS, TAX_BRACKETS } from '../constants/tax-constants';
import { calculateTax, getTaxCalculationRequestFromSearchParams, getTaxCalculationRequestSearchParams } from './tax-utils';

const ALL_STATUSES = Object.values(FilingStatus);
const EXPECTED_RATES = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];

describe('bracket data integrity', () => {
  it('registers every year we ship data for and defaults to the newest', () => {
    expect(AVAILABLE_TAX_YEARS).toEqual([2023, 2024, 2025, 2026]);
    expect(DEFAULT_TAX_YEAR).toBe(2026);
  });

  AVAILABLE_TAX_YEARS.forEach(year => {
    ALL_STATUSES.forEach(status => {
      it(`${year} ${status} brackets are contiguous, ascending and open-ended at the top`, () => {
        const brackets = TAX_BRACKETS[year][status];
        expect(brackets.map((b: any) => b.rate)).toEqual(EXPECTED_RATES);
        expect(brackets[0].minIncome).toBe(0);
        expect(brackets[brackets.length - 1].maxIncome).toBeUndefined();
        brackets.slice(0, -1).forEach((bracket: any, i: number) => {
          expect(bracket.maxIncome).toBeGreaterThan(bracket.minIncome);
          expect(brackets[i + 1].minIncome).toBe(bracket.maxIncome);
        });
      });
    });

    it(`${year} standard deduction for married filing jointly is twice the single amount`, () => {
      expect(STANDARD_DEDUCTIONS[year][FilingStatus.MARRIED_JOINT])
        .toBe(STANDARD_DEDUCTIONS[year][FilingStatus.SINGLE] * 2);
      expect(STANDARD_DEDUCTIONS[year][FilingStatus.MARRIED_SEPARATE])
        .toBe(STANDARD_DEDUCTIONS[year][FilingStatus.SINGLE]);
    });
  });
});

describe('calculateTax', () => {
  const request = (overrides: Partial<Parameters<typeof calculateTax>[0]> = {}) => ({
    income: 0,
    filingStatus: FilingStatus.SINGLE,
    deductions: 0,
    nonRefundableCredits: 0,
    refundableCredits: 0,
    year: 2026,
    ...overrides
  });

  it('fills brackets from the bottom up', () => {
    // 12,400 @ 10% + 38,000 @ 12% + 49,600 @ 22%
    const result = calculateTax(request({ income: 100000 }));
    expect(result.totalTax).toBeCloseTo(16712, 2);
    expect(result.bracketCalculations[0].taxForBracket).toBeCloseTo(1240, 2);
    expect(result.bracketCalculations[2].incomeInBracket).toBeCloseTo(49600, 2);
    expect(result.bracketCalculations.slice(3).every(b => b.incomeInBracket === 0)).toBe(true);
  });

  it('uses the filing status brackets, not just the single ones', () => {
    const result = calculateTax(request({ income: 200000, filingStatus: FilingStatus.MARRIED_JOINT }));
    expect(result.totalTax).toBeCloseTo(33424, 2);
  });

  it('taxes income above the top threshold at the top rate', () => {
    const result = calculateTax(request({ income: 1000000 }));
    const top = result.bracketCalculations[result.bracketCalculations.length - 1];
    expect(top.incomeInBracket).toBeCloseTo(359400, 2);
    expect(top.max).toBeUndefined();
  });

  it('subtracts deductions before applying brackets', () => {
    const deducted = calculateTax(request({ income: 100000, deductions: 16100 }));
    const equivalent = calculateTax(request({ income: 83900 }));
    expect(deducted.taxableIncome).toBe(83900);
    expect(deducted.totalTax).toBeCloseTo(equivalent.totalTax, 6);
  });

  it('never lets deductions push taxable income below zero', () => {
    const result = calculateTax(request({ income: 5000, deductions: 20000 }));
    expect(result.taxableIncome).toBe(0);
    expect(result.totalTax).toBe(0);
  });

  it('stops non-refundable credits at zero and reports the wasted remainder', () => {
    const result = calculateTax(request({ income: 50000, nonRefundableCredits: 999999 }));
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.taxAfterCredits).toBe(0);
    expect(result.nonRefundableCreditsApplied).toBeCloseTo(result.totalTax, 6);
    expect(result.nonRefundableCreditsUnused).toBeCloseTo(999999 - result.totalTax, 6);
  });

  it('pays out refundable credits past zero as a refund', () => {
    const result = calculateTax(request({ income: 50000, refundableCredits: 999999 }));
    expect(result.taxAfterCredits).toBeCloseTo(result.totalTax - 999999, 6);
    expect(result.taxAfterCredits).toBeLessThan(0);
  });

  it('spends non-refundable credits before refundable ones, so none are wasted', () => {
    // 6,320 of tax, 2,000 non-refundable and 8,800 refundable
    const result = calculateTax(request({
      income: 89000,
      filingStatus: FilingStatus.MARRIED_JOINT,
      deductions: 32200,
      nonRefundableCredits: 2000,
      refundableCredits: 8800
    }));
    expect(result.totalTax).toBeCloseTo(6320, 2);
    expect(result.nonRefundableCreditsApplied).toBeCloseTo(2000, 2);
    expect(result.nonRefundableCreditsUnused).toBe(0);
    expect(result.taxAfterCredits).toBeCloseTo(-4480, 2);
  });

  it('refunds the married filer with four children rather than charging them', () => {
    // 89,000 salary, standard deduction, child credit of 2,200 a head with 1,700 refundable
    const result = calculateTax(request({
      income: 89000,
      filingStatus: FilingStatus.MARRIED_JOINT,
      deductions: 32200,
      nonRefundableCredits: 4 * 500,
      refundableCredits: 4 * 1700
    }));
    expect(result.taxableIncome).toBe(56800);
    expect(result.totalTax).toBeCloseTo(6320, 2);
    expect(result.taxAfterCredits).toBeCloseTo(-2480, 2);
  });

  it('charges nothing on zero income', () => {
    const result = calculateTax(request());
    expect(result.totalTax).toBe(0);
  });
});

describe('url round trip', () => {
  it('restores every input from a shared link', () => {
    const config = {
      income: 123456,
      filingStatus: FilingStatus.HEAD_OF_HOUSEHOLD,
      deductions: 1000,
      nonRefundableCredits: 500,
      refundableCredits: 250,
      year: 2024
    };
    const restored = getTaxCalculationRequestFromSearchParams(getTaxCalculationRequestSearchParams(config));
    expect(restored).toEqual(config);
  });

  it('returns nothing when the url carries no inputs', () => {
    expect(getTaxCalculationRequestFromSearchParams(new URLSearchParams())).toBeUndefined();
  });

  it('reads a link shared before credits were split as non-refundable', () => {
    const restored = getTaxCalculationRequestFromSearchParams(
      new URLSearchParams({ income: '50000', credits: '1500' })
    );
    expect(restored?.nonRefundableCredits).toBe(1500);
    expect(restored?.refundableCredits).toBe(0);
  });

  it('falls back to defaults for unknown filing status and unsupported year', () => {
    const restored = getTaxCalculationRequestFromSearchParams(
      new URLSearchParams({ income: '50000', filingStatus: 'bogus', year: '1999' })
    );
    expect(restored?.filingStatus).toBe(FilingStatus.SINGLE);
    expect(restored?.year).toBe(DEFAULT_TAX_YEAR);
  });
});
