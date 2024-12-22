import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MealItem } from "../../components/meal-item/meal-item";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { Meal } from "../../types/meal";

export function MealPage(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  const { id } = useParams<{ id: string }>();

  const mealById = useSelector((state: RootState) =>
    state.data.meals.find((meal) => meal.id === id)
  );

  return (
    <>
      <Helmet>
        <title>Nutrition | {activeMeal ? activeMeal.name : mealById ? mealById.name : ''}</title>
      </Helmet>
      {
        activeMeal ? <MealItem meal={activeMeal as Meal}/> :
          mealById ? <MealItem meal={mealById}/> :
          <></>
      }
    </>
  )
}
