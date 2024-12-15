import { useDispatch, useSelector } from "react-redux";
import { meals } from "../../mocks/meals";
import { RootState } from "../../store/root-reducer";
import { Layout } from "../../components/layout/layout";
import { redirectToRoute, setActiveMeal, setActiveMealType } from "../../store/action";
import { generatePath, Link } from "react-router-dom";
import { AppRoute } from "../../const";
import { ReactComponent as MealIcon} from "../../img/icons/meal-icon.svg"

export function MealsByTypePage(): JSX.Element {
  const dispatch = useDispatch();
  const activeMealType = useSelector((state: RootState) => state.page.activeMealType);

  const filteredMeals = meals.filter((meal) => meal.type === activeMealType);

  const handleSetActiveMeal = (meal: typeof meals[0]) => {
    dispatch(setActiveMeal({ meal }));
    const link = generatePath(AppRoute.MealPage, { id: meal.id });
    dispatch(redirectToRoute(link as AppRoute));
  };

  const handleGoToMain = () => {
    dispatch(setActiveMeal({meal: null}));
    dispatch(setActiveMealType({type: null}))
  }

  return (
    <Layout>
      <div className="meals-page">
        <h2 className="title title--2">Выберите блюдо:</h2>
        {filteredMeals.map((meal) => (
          <Link
            className="meals-page__item"
            to="#"
            key={meal.id}
            onClick={(event) => {
              event.preventDefault();
              handleSetActiveMeal(meal);
            }}
          >
            <div className="meals-page__image-wrapper">
              {
                meal.picture
                ?
                <img src={meal.picture} alt={meal.name} width={80} height={80}/>
                :
                <MealIcon/>
              }
            </div>
            <div className="meals-page__wrapper">
              {meal.name}
              <div>
                <span>Ккал: {meal.calories} </span>
                <span>Б: {meal.proteins}г </span>
                <span>Ж: {meal.fats}г </span>
                <span>У: {meal.carbs}г </span>
              </div>
            </div>
          </Link>
        ))}
        <Link className="button button--submit" to={AppRoute.Root} onClick={() => handleGoToMain()}>Домой</Link>
      </div>
    </Layout>
  );
}
