import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { Layout } from "../../components/layout/layout";
import { Helmet } from "react-helmet-async";
import { MealItem } from "../../components/meal-item/meal-item";

export function MealPage(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  return (
    <Layout>
      <Helmet>
        <title>Nutrition | {`${activeMeal?.name}`}</title>
      </Helmet>
      {
        activeMeal && <MealItem meal={activeMeal}/>
      }
    </Layout>
  )
}
