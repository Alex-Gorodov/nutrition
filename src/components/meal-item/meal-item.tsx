import { Meal } from "../../types/meal";

type MealItemProps = {
  meal: Meal;
}

export function MealItem({meal}: MealItemProps): JSX.Element {

  return (
    <div>
      {meal.name}
    </div>
  )
}
