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
    credits: 0,
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

  it('treats credits as non-refundable', () => {
    const result = calculateTax(request({ income: 50000, credits: 999999 }));
    expect(result.totalTax).toBeGreaterThan(0);
    expect(result.taxAfterCredits).toBe(0);
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
      credits: 500,
      year: 2024
    };
    const restored = getTaxCalculationRequestFromSearchParams(getTaxCalculationRequestSearchParams(config));
    expect(restored).toEqual(config);
  });

  it('returns nothing when the url carries no inputs', () => {
    expect(getTaxCalculationRequestFromSearchParams(new URLSearchParams())).toBeUndefined();
  });

  it('falls back to defaults for unknown filing status and unsupported year', () => {
    const restored = getTaxCalculationRequestFromSearchParams(
      new URLSearchParams({ income: '50000', filingStatus: 'bogus', year: '1999' })
    );
    expect(restored?.filingStatus).toBe(FilingStatus.SINGLE);
    expect(restored?.year).toBe(DEFAULT_TAX_YEAR);
  });
});
