import { NutritionTarget, NutritionTargetToCaloricGoals, CaloricGoals } from "../const";

export const calculateActiveBmr = (
  bmr: number,
  activityLevel: number,
  nutritionTarget: NutritionTarget
): number => {
  const caloricGoalKey = NutritionTargetToCaloricGoals[nutritionTarget];
  const caloricGoal = CaloricGoals[caloricGoalKey];
  return Math.floor(bmr * activityLevel * caloricGoal);
};
