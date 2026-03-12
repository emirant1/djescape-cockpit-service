import { IsCustomDateConstraint } from "./custom-date.decorator";

describe('IsCustomDateConstraint', () => {
    let constraint: IsCustomDateConstraint;

    beforeEach(() => {
        constraint = new IsCustomDateConstraint();
    });

    it('should return true for valid dates in dd.MM.yyyy format', () => {
        expect(constraint.validate('30.01.2026')).toBe(true);
        expect(constraint.validate('29.02.2024')).toBe(true);
    });

    it('should return false for invalid formats', () => {
        expect(constraint.validate('2026-01-30')).toBe(false);
        expect(constraint.validate('30/01/2026')).toBe(false);
        expect(constraint.validate('1.1.26')).toBe(false);
    });

    it('should return false for non-existent calendar dates', () => {
        expect(constraint.validate('32.01.2026')).toBe(false);
        expect(constraint.validate('29.02.2025')).toBe(false);
        expect(constraint.validate('30.02.2026')).toBe(false);
    });

    it('should return false for undefined and empty calendar dates', () => {
        expect(constraint.validate('')).toBe(false);
    });
});