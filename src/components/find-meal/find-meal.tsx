import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { useSetActiveMeal } from "../../hooks/useSetActiveMeal";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

export function FindMeal(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.data.activeMeal);
  const isMealsLoading = useSelector((state: RootState) => state.data.isMealsDataLoading);

  const handleSetActiveMeal = useSetActiveMeal();

  return (
    isMealsLoading ? <LoadingSpinner size={"80"}/> :
    <section className="meals">
      <div className="meal">
        {activeMeal ? (
          <MealItem meal={activeMeal} />
        ) : (
          <h1 className="title title--secondary">Выберите тип приема пищи</h1>
        )}
      </div>

      {!activeMeal && (
        <div className="meals__buttons">
          {Object.values(MealType).map((type) => (
            <button
              className={`button meal__button meal__button--${type.toLowerCase()}`}
              type="button"
              key={type}
              onClick={() => handleSetActiveMeal(type)}
            >
              <span>{MealTypeTranslations[type]}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
