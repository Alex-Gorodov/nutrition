import { MealType } from "../const";

export type Meal = {
  id: number;
  name: string;
  ingredients: string[];
  type: MealType;
}
