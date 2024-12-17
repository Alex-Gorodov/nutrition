import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MealItem } from "../../components/meal-item/meal-item";
import { Helmet } from "react-helmet-async";

export function MealPage(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  return (
    <>
      <Helmet>
        <title>Nutrition | {activeMeal ? activeMeal.name : ''}</title>
      </Helmet>
      {activeMeal && <MealItem meal={activeMeal}/>}
    </>
  )
}
