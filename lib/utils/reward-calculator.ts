/**
 * Reward system constants
 */
const BASE_POINTS = 50;

const CATEGORY_MULTIPLIERS: Record<string, number> = {
  plastic: 1.5,
  metal: 2.0,
  organic: 1.2,
  mixed: 1.1,
  general: 1.0,
};

const ACCURACY_THRESHOLD = 0.9;
const ACCURACY_BONUS = 2.0;
const NO_BONUS = 1.0;

/**
 * Calculates reward points for a pickup.
 * Formula: TotalPoints = Math.floor((BasePoints * CategoryMultiplier) * AccuracyBonus)
 * 
 * @param formValue The category of the waste
 * @param probability The confidence score from the classification
 * @returns The calculated reward points
 */
export function calculateRewardPoints(formValue: string, probability: number): number {
  const multiplier = CATEGORY_MULTIPLIERS[formValue.toLowerCase()] || CATEGORY_MULTIPLIERS.general;
  const bonus = probability > ACCURACY_THRESHOLD ? ACCURACY_BONUS : NO_BONUS;
  
  return Math.floor((BASE_POINTS * multiplier) * bonus);
}
