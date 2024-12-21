import { useDispatch, useSelector } from "react-redux";
import { AppRoute, MealType, MealTypeTranslations } from "../../const";
import { Meal } from "../../types/meal";
import { formatRecipe } from "../../utils/formatRecipe";
import { RootState } from "../../store/root-reducer";
import { trackUserMeal } from "../../store/action";
import { useSetActiveMeal } from "../../hooks/useSetActiveMeal";
import { addMealToUserSchedule } from "../../store/api-actions";
import { useState } from "react";
import { ReactComponent as Refresh } from '../../img/icons/refresh-icon.svg'
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

type MealItemProps = {
  meal: Meal;
};

export function MealItem({ meal }: MealItemProps): JSX.Element {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formattedRecipe = meal.recipe ? formatRecipe(meal.recipe) : '';
  const activeMeal = useSelector((state: RootState) => state.page.activeMeal);
  const activeUser = useSelector((state: RootState) => state.user);

  const user = useSelector((state: RootState) => state.data.users.find((u) => u.id === activeUser.id));

  const { id } = useParams<{ id: string }>();

  const mealById = useSelector((state: RootState) =>
    state.data.meals.find((meal) => meal.id === id)
  );

  const [isAdded, setIsAdded] = useState(false);

  const handleSetActiveMeal = useSetActiveMeal();

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToSchedule = async() => {if (activeMeal) {
    setIsAdding(true);
    const updatedMeal = {
      ...activeMeal,
      id: `${activeMeal.id}-${user?.mealSchedule?.length || '0'}`
    };
    dispatch(
      trackUserMeal({
        user: activeUser,
        meal: updatedMeal,
      })
    );

    await addMealToUserSchedule(activeUser, updatedMeal);
    setIsAdding(false);

  }
    activeMeal && setIsAdded(true);
  }

  const handleResetMeal = () => {
    const link = generatePath(AppRoute.MealsByTypePage, { type: mealById?.type || MealType.Breakfast });
    navigate(link as AppRoute);
  };

  return (
    <div className="meal">
      <div className="meal__item meal-item">
        <h2 className="title title--2 meal-item__title">
        {meal.name.charAt(0).toUpperCase() + meal.name.slice(1)} <span className="meal-item__type">(на {MealTypeTranslations[meal.type].toLowerCase()})</span>
        </h2>
        <div className="meal-item__image-wrapper">
          {meal.picture ? (
            <img
              className="meal-item__picture"
              src={meal.picture}
              alt={meal.name}
              width={400}
              height={400}
              loading="lazy"
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
              <li key={`${meal.name}-ingredient-${i}`}>
                {i.trimStart().replace(/^\S/, (char) => char.toUpperCase())}
              </li>
            ))}
          </ol>
        </div>
        {
          meal.recipe &&
          <div className="meal-item__recipe-wrapper">
  <span className="title title--3">Рецепт:</span>
  <ol className="meal-item__recipe-list">
    {formattedRecipe
      .split("\n")
      .map((line, index) => (
        <li key={`recipe-line-${index}`}>
          {line.charAt(0).toUpperCase() + line.slice(1)}
        </li>
      ))}
  </ol>
</div>
        }
        <div className="meal-item__buttons">
          <button className="button button--submit meal-item__button" onClick={() => handleAddToSchedule()}>{isAdded ? 'Молодец!' : isAdding ? <LoadingSpinner color="#ffffff" size={"20"}/> : 'Кушац!'}</button>
          <button className="button meal-item__button meal-item__button--refresh" onClick={() => handleSetActiveMeal(activeMeal ? activeMeal.type : mealById ? mealById.type : MealType.Breakfast)}><Refresh/></button>
          <button className="button meal-item__button meal-item__button--back" onClick={() => handleResetMeal()}>Назад</button>
        </div>
      </div>
    </div>
  );
}
