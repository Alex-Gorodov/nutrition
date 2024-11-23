import { Meal } from "../../types/meal";

type MealItemProps = {
  meal: Meal;
}

export function MealItem({meal}: MealItemProps): JSX.Element {

  return (
    <div>
      <h2 className="title title--2">
        {meal.name}
      </h2>
      {
        meal.picture
        ?
        <img src={meal.picture} alt={meal.name} width={400} height={400}/>
        : ''
      }
      <div>
        <p>
          per 100 g:
        </p>
        <p>
          <span>cal: </span>
          <span>{meal.calories}g</span>
        </p>
        <p>
          <span>proteins: </span>
          <span>{meal.proteins}g</span>
        </p>
        <p>
          <span>fats: </span>
          <span>{meal.fats}g</span>
        </p>
        <p>
          <span>carbs: </span>
          <span>{meal.carbs}g</span>
        </p>
        <ul>
          {
            meal.ingredients.map((i) => {
              return (
                <li>{i}</li>
              )
            })
          }
        </ul>
        <p>{meal.recipe ?? ''}</p>
      </div>
    </div>
  )
}
