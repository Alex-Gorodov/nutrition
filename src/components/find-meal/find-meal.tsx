import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { MealType, MealTypeTranslations } from "../../const";
import { MealItem } from "../meal-item/meal-item";
import { useSetActiveMeal } from "../../hooks/useSetActiveMeal";

export function FindMeal(): JSX.Element {
  const activeMeal = useSelector((state: RootState) => state.data.activeMeal);
  const handleSetActiveMeal = useSetActiveMeal();

  return (
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
