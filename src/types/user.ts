import { ActivityLevel, Genders, NutritionTarget, TrainingSession } from "../const";
import { Meal } from "./meal";

export type User = {
  id: string;
  name: string,
  email: string,
  token: string,
  isAdmin: boolean,
  mealSchedule: [Meal, Date][],
  trainingSessions: TrainingSession[],
  activityLevel: ActivityLevel,
  avatar: string,
  gender: Genders,
  age: number,
  weight: number,
  height: number,
  target: NutritionTarget,
};
