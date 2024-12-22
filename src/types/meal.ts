import { MealType } from "../const";

export type Meal = {
  id: string;
  name: string;
  ingredients: string[];
  type: MealType;
  recipe?: string;
  picture?: string;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export type UserMealData = Omit<Meal, 'picture' | 'recipe' | 'ingredients'>;
