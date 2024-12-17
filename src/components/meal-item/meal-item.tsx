import { useDispatch, useSelector } from "react-redux";
import { AppRoute, MealTypeTranslations } from "../../const";
import { Meal } from "../../types/meal";
import { formatRecipe } from "../../utils/formatRecipe";
import { RootState } from "../../store/root-reducer";
import { redirectToRoute, setActiveMeal } from "../../store/action";
import { useSetActiveMeal } from "../../hooks/useSetActiveMeal";
import { addMealToUserSchedule } from "../../store/api-actions";
import { useState } from "react";

type MealItemProps = {
  meal: Meal;
};

export function MealItem({ meal }: MealItemProps): JSX.Element {
  const dispatch = useDispatch();
  const formattedRecipe = meal.recipe ? formatRecipe(meal.recipe) : '';
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const activeUser = useSelector((state: RootState) => state.user);

  const [isAdded, setIsAdded] = useState(false);

  const handleSetActiveMeal = useSetActiveMeal();

  const handleAddToSchedule = () => {
    activeMeal && addMealToUserSchedule(activeUser, activeMeal, dispatch);
    activeMeal && setIsAdded(true);
  }

  const handleResetMeal = () => {
    dispatch(setActiveMeal({ meal: null }))
    dispatch(redirectToRoute(AppRoute.Root))
  }

  return (
    <div className="meal">
      <div className="meal__item meal-item">
        <h2 className="title title--2 meal-item__title">
          {meal.name} <span className="meal-item__type">(на {MealTypeTranslations[meal.type].toLowerCase()})</span>
        </h2>
        <div className="meal-item__image-wrapper">
          {meal.picture ? (
            <img
              className="meal-item__picture"
              src={meal.picture}
              alt={meal.name}
              width={400}
              height={400}
            />
          ) : (
            <p className="meal-item__alt-picture">
              Тут могла бы быть фотография блюда :)
            </p>
          )}
        </div>
        <div className="meal-item__info">
          <h3 className="title title--3">Пищевая ценность на 100 г:</h3>
          <ul>
            <li>
              <i>Ккал: </i>
              <b>{meal.calories}г</b>
            </li>
            <li>
              <i>Белки: </i>
              <b>{meal.proteins}г</b>
            </li>
            <li>
              <i>Жиры: </i>
              <b>{meal.fats}г</b>
            </li>
            <li>
              <i>Углеводы: </i>
              <b>{meal.carbs}г</b>
            </li>
          </ul>
          <span className="title title--3">Ингредиенты:</span>
          <ol>
            {meal.ingredients.map((i) => (
              <li key={`${meal.name}-ingredient-${i}`}>{i}</li>
            ))}
          </ol>
        </div>
        {
          meal.recipe &&
          <div className="meal-item__recipe">
            <span className="title title--3">Рецепт:</span>
            <p>
              {formattedRecipe.split("\n").map((line, index) => (
                <span key={`${meal.name}-recipe-line-${index}`}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        }
        {activeMeal && (
          <div className="meal__buttons">
            <button className="meal__button meal__button--accept" onClick={() => handleAddToSchedule()}>{isAdded ? 'Приятного аппетита!' : 'Это я ем!'}</button>
            <button className="meal__button meal__button--update" onClick={() => handleSetActiveMeal(activeMeal.type)}>Хочу другое!</button>
            <button className="meal__button meal__button--clear" onClick={() => handleResetMeal()}>Очистить</button>
          </div>
        )}
      </div>
    </div>
  );
}
