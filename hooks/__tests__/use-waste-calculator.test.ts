import { renderHook, act } from '@testing-library/react';
import { useWasteCalculator, WasteType } from '../use-waste-calculator';
import { describe, it, expect } from 'vitest';

describe('useWasteCalculator', () => {
  it('calculates cost and CO2 offset for plastic', () => {
    const { result } = renderHook(() => useWasteCalculator());
    
    act(() => {
      result.current.setWasteType('plastic');
      result.current.setQuantity(10);
    });

    // Plastic: 50 Ksh/kg, 0.5kg CO2/kg (assumed rates)
    expect(result.current.cost).toBe(500);
    expect(result.current.co2Offset).toBe(5);
  });
});
