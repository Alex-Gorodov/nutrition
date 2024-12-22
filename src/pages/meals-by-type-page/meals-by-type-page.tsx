import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { setActiveMeal, setActiveMealType, setNewMealFormOpened } from "../../store/action";
import { generatePath, Link, useNavigate, useParams } from "react-router-dom";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { ReactComponent as MealIcon } from "../../img/icons/meal-icon.svg";
import { Helmet } from "react-helmet-async";
import { getCapitalizeString } from "../../utils/getCapitalizeString";
// import { useEffect } from "react";

export function MealsByTypePage(): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);

  const meals = useSelector((state: RootState) => state.data.meals);

  const { type } = useParams<{ type: MealType }>();

  const filteredMeals = meals.filter((meal) => meal.type === type);

  const handleSetActiveMeal = (meal: typeof meals[0]) => {
    dispatch(setActiveMeal({ meal }));
    const link = generatePath(AppRoute.MealPage, { id: meal.id });
    navigate(link as AppRoute);
  };

  const handleOpenForm = () => {
    dispatch(setNewMealFormOpened({ isOpened: true }));
    type && dispatch(setActiveMealType({ type }))
  };

  const handleGoHome = () => {
    activeMeal && dispatch(setActiveMeal({ meal: null }))
  }

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

            return type ? mealTypeTitles[type as MealType] : '';
          })()}
        </title>
      </Helmet>
      <h2 className="title title--2">Выбери {type && MealTypeTranslations[type as MealType].toLowerCase()}:</h2>
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
              <img src={meal.picture} alt={getCapitalizeString(meal.name)} width={80} height={80} />
            ) : (
              <MealIcon />
            )}
          </div>
          <div className="meals-page__wrapper">
            <p className="title title--3">{getCapitalizeString(meal.name)}</p>
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
      <Link className="button button--submit" to={AppRoute.Root} onClick={() => handleGoHome()}>
        Домой
      </Link>
    </div>
  );
}
