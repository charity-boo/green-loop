/**
 * Carbon offset factors (kg CO2 saved per kg of material diverted from landfill)
 * Sources: Various industry averages for recycling impact.
 */
export const CARBON_OFFSETS = {
  Plastic: 1.5,
  Paper: 0.9,
  Glass: 0.3,
  Metal: 2.8,
  Organic: 0.5,
  Unknown: 0.4
} as const;

export type MaterialWeight = { 
  type: string; 
  weight: number;
};

/**
 * Calculates carbon savings based on material types and weights.
 * @param materials Array of materials with their weights in KG.
 * @returns Object containing total CO2 saved (kg) and equivalent trees planted.
 */
export function calculateCarbonSavings(materials: MaterialWeight[]) {
  const totalCo2Saved = materials.reduce((acc, curr) => {
    const type = curr.type as keyof typeof CARBON_OFFSETS;
    const factor = CARBON_OFFSETS[type] || CARBON_OFFSETS.Unknown;
    return acc + (curr.weight * factor);
  }, 0);

  // 1 mature tree absorbs approximately 20kg of CO2 per year.
  const treesEquivalent = Math.floor(totalCo2Saved / 20);

  return {
    totalCo2Saved: Number(totalCo2Saved.toFixed(2)),
    treesEquivalent: Math.max(0, treesEquivalent)
  };
}
