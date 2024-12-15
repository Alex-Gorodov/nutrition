import { useDispatch, useSelector } from "react-redux";
import { AppRoute, MealType } from "../const";
import { RootState } from "../store/root-reducer";
import { redirectToRoute, setActiveMeal } from "../store/action";
import { generatePath } from "react-router-dom";
import { meals } from "../mocks/meals";

export function useSetActiveMeal() {
  const dispatch = useDispatch();
  // const meals = useSelector((state: RootState) => state.data.meals);

  const handleSetActiveMeal = (mealType: MealType) => {
    const mealsOfType = meals.filter((meal) => meal.type === mealType);

    if (mealsOfType.length > 0) {
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];
      const link = generatePath(AppRoute.MealPage, {
        id: `${randomMeal.id}`,
      });
      dispatch(setActiveMeal({ meal: randomMeal }));
      dispatch(redirectToRoute(link as AppRoute));
    } else {
      dispatch(setActiveMeal({ meal: null }));
    }
  };

  return handleSetActiveMeal;
}
