import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/root-reducer"
import { setActiveMeal } from "../../store/action";
import { MealType } from "../../const";
import { MealItem } from "../meal-item/meal-item";

export function FindMeal(): JSX.Element {

  const dispatch = useDispatch();

  const meals = useSelector((state: RootState) => state.data.meals);

  const activeMeal = useSelector((state: RootState) => state.data.activeMeal);

  const handleSetActiveMeal = (mealType: MealType) => {
    const meal = meals.find((meal) => meal.type === mealType);
    if (meal) {
      dispatch(setActiveMeal({ meal }));
    } else {
      dispatch(setActiveMeal({ meal: null }))
    }
  };

  return (
    <div>
      <div>
        {
          Object.values(MealType).map((type) => (
            <button key={type} onClick={() => handleSetActiveMeal(type)}>
              <span>{type}</span>
            </button>
          ))
        }
      </div>

      <div>
        Active meal:
        {
          activeMeal ? <MealItem meal={activeMeal}/> : 'choose meal type'
        }
      </div>
    </div>
  )
}
