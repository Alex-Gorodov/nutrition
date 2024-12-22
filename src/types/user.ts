import { ActivityLevel, Genders, NutritionTarget } from "../const";
import { UserMealData } from "./meal";
import { TrainingSession } from "./trainingSession";

export type User = {
  id: string;
  name: string,
  email: string,
  token: string,
  isAdmin: boolean,
  mealSchedule: [UserMealData, Date][],
  trainingSessions: TrainingSession[],
  activityLevel: ActivityLevel,
  avatar: string,
  gender: Genders,
  age: number,
  weight: number,
  height: number,
  target: NutritionTarget,
};
