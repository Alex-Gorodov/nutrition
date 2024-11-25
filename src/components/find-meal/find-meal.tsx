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
    const mealsOfType = meals.filter((meal) => meal.type === mealType);

    if (mealsOfType.length > 0) {
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];
      dispatch(setActiveMeal({ meal: randomMeal }));
    } else {
      dispatch(setActiveMeal({ meal: null }));
    }
  };

  return (
    <div>
      <div>
        {
          Object.values(MealType).map((type) => (
            <button className="button" type={"button"} key={type} onClick={() => handleSetActiveMeal(type)}>
              <span>{type}</span>
            </button>
          ))
        }
      </div>

      <div>
        {
          activeMeal ? <MealItem meal={activeMeal}/> : 'Choose meal type'
        }
      </div>
      {
        activeMeal && <button onClick={() => dispatch(setActiveMeal({meal: null}))}>clear</button>
      }
    </div>
  )
}
