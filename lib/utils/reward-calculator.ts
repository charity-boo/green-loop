/**
 * Reward system constants
 */
const BASE_POINTS = 50;

// Significant bonus for using AI classification to encourage adoption
const AI_ADOPTION_BONUS = 50; 

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
 * Formula: TotalPoints = Math.floor((BasePoints * CategoryMultiplier) * AccuracyBonus) + (isAiClassified ? AI_ADOPTION_BONUS : 0)
 * 
 * @param formValue The category of the waste
 * @param probability The confidence score from the classification
 * @param isAiClassified Whether AI was used for this classification
 * @returns The calculated reward points
 */
export function calculateRewardPoints(
  formValue: string, 
  probability: number, 
  isAiClassified: boolean = false
): number {
  const multiplier = CATEGORY_MULTIPLIERS[formValue.toLowerCase()] || CATEGORY_MULTIPLIERS.general;
  const accuracyBonus = probability > ACCURACY_THRESHOLD ? ACCURACY_BONUS : NO_BONUS;
  
  const baseReward = Math.floor((BASE_POINTS * multiplier) * accuracyBonus);
  const adoptionBonus = isAiClassified ? AI_ADOPTION_BONUS : 0;
  
  return baseReward + adoptionBonus;
}
