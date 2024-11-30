import { useDispatch, useSelector } from "react-redux";
import { MealType } from "../const";
import { RootState } from "../store/root-reducer";
import { setActiveMeal } from "../store/action";

export function useSetActiveMeal() {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.data.meals);

  const handleSetActiveMeal = (mealType: MealType) => {
    const mealsOfType = meals.filter((meal) => meal.type === mealType);

    if (mealsOfType.length > 0) {
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];
      dispatch(setActiveMeal({ meal: randomMeal }));
    } else {
      dispatch(setActiveMeal({ meal: null }));
    }
  };

  return handleSetActiveMeal;
}
