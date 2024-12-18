import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { redirectToRoute, setActiveMeal, setActiveMealType, setNewMealFormOpened } from "../../store/action";
import { generatePath, Link, useParams } from "react-router-dom";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { ReactComponent as MealIcon } from "../../img/icons/meal-icon.svg";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

export function MealsByTypePage(): JSX.Element {
  const dispatch = useDispatch();
  const activeMealType = useSelector((state: RootState) => state.page.activeMealType);

  const meals = useSelector((state: RootState) => state.data.meals);

  const { type } = useParams<{ type: string }>();

  // Устанавливаем активный тип блюда на основе параметра маршрута
  useEffect(() => {
    if (type && activeMealType !== type) {
      dispatch(setActiveMealType({ type: type as MealType }));
    }
  }, [type, activeMealType, dispatch]);

  const filteredMeals = meals.filter((meal) => meal.type === activeMealType);

  const handleSetActiveMeal = (meal: typeof meals[0]) => {
    dispatch(setActiveMeal({ meal }));
    const link = generatePath(AppRoute.MealPage, { id: meal.id });
    dispatch(redirectToRoute(link as AppRoute));
  };

  const handleGoToMain = () => {
    dispatch(setActiveMeal({ meal: null }));
    dispatch(setActiveMealType({ type: null }));
  };

  const handleOpenForm = () => {
    dispatch(setNewMealFormOpened({ isOpened: true }));
  };

  return (
    <div className="meals-page">
      <Helmet>
        <title>
          Nutrition | {(() => {
            const mealTypeTitles: Record<MealType, string> = {
              [MealType.Breakfast]: MealTypeTranslations.Breakfast,
              [MealType.Lunch]: MealTypeTranslations.Lunch,
              [MealType.Dinner]: MealTypeTranslations.Dinner,
              [MealType.Snack]: MealTypeTranslations.Snack,
            };

            return activeMealType ? mealTypeTitles[activeMealType] : '';
          })()}
        </title>
      </Helmet>
      <h2 className="title title--2">Выбери блюдо:</h2>
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
            {meal.picture ? (
              <img src={meal.picture} alt={meal.name} width={80} height={80} />
            ) : (
              <MealIcon />
            )}
          </div>
          <div className="meals-page__wrapper">
            <p className="title title--3">{meal.name}</p>
            <div>
              <span>Ккал: {meal.calories} </span>
              <span>Б: {meal.proteins}г </span>
              <span>Ж: {meal.fats}г </span>
              <span>У: {meal.carbs}г </span>
            </div>
          </div>
        </Link>
      ))}
      <button
        className="button meals-page__add-meal-btn"
        onClick={() => handleOpenForm()}
      >
        +
      </button>
      <Link className="button button--submit" to={AppRoute.Root} onClick={() => handleGoToMain()}>
        Домой
      </Link>
    </div>
  );
}
