import { useDispatch, useSelector } from "react-redux";
import { AppRoute, MealType } from "../const";
import { setActiveMeal } from "../store/action";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { RootState } from "../store/root-reducer";

export function useSetActiveMeal() {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.data.meals);
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const mealById = useSelector((state: RootState) =>
    state.data.meals.find((meal) => meal.id === id)
  );

  const handleSetActiveMeal = (mealType: MealType) => {
    // Отфильтровываем текущее блюдо, чтобы оно не попало в выбор
    const mealsOfType = meals.filter((meal) => meal.type === mealType && meal.id !== mealById?.id);

    if (mealsOfType.length > 0) {
      // Если есть другие блюда, случайным образом выбираем одно
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];

      const link = generatePath(AppRoute.MealPage, {
        id: `${randomMeal.id}`,
      });
      dispatch(setActiveMeal({ meal: randomMeal }));
      navigate(link as AppRoute);
    } else {
      // Если других блюд нет, сбрасываем активное блюдо
      dispatch(setActiveMeal({ meal: null }));
    }
  };

  return handleSetActiveMeal;
}
