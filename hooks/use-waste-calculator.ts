import { useState, useMemo } from 'react';

export type WasteType = 'plastic' | 'paper' | 'organic' | 'e-waste' | 'metal';

const RATES: Record<WasteType, { cost: number; co2: number }> = {
  plastic: { cost: 50, co2: 0.5 },
  paper: { cost: 30, co2: 0.3 },
  organic: { cost: 20, co2: 0.8 },
  'e-waste': { cost: 200, co2: 1.2 },
  metal: { cost: 100, co2: 0.6 },
};

export function useWasteCalculator() {
  const [wasteType, setWasteType] = useState<WasteType>('plastic');
  const [quantity, setQuantity] = useState<number>(0);

  const { cost, co2Offset } = useMemo(() => {
    const rate = RATES[wasteType];
    return {
      cost: quantity * rate.cost,
      co2Offset: quantity * rate.co2,
    };
  }, [wasteType, quantity]);

  return {
    wasteType,
    setWasteType,
    quantity,
    setQuantity,
    cost,
    co2Offset,
  };
}
