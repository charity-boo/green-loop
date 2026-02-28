import { describe, it, expect } from 'vitest';
import { calculateCarbonSavings } from './carbon';

describe('calculateCarbonSavings', () => {
  it('calculates correct savings for multiple material types', () => {
    const materials = [
      { type: 'Plastic', weight: 10 },
      { type: 'Paper', weight: 5 }
    ];
    const result = calculateCarbonSavings(materials);
    expect(result.totalCo2Saved).toBe(19.5); // (10 * 1.5) + (5 * 0.9)
  });

  it('handles unknown material types with a default offset', () => {
    const materials = [
      { type: 'UnknownMaterial', weight: 10 }
    ];
    const result = calculateCarbonSavings(materials);
    expect(result.totalCo2Saved).toBe(4.0); // 10 * 0.4
  });

  it('calculates correct trees equivalent', () => {
    const materials = [
      { type: 'Plastic', weight: 20 }
    ];
    const result = calculateCarbonSavings(materials);
    expect(result.totalCo2Saved).toBe(30);
    expect(result.treesEquivalent).toBe(1); // 30 / 20 = 1.5 -> Math.floor(1.5) = 1
  });
});
