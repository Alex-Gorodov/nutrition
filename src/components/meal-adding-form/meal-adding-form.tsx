import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { ChangeEvent, FormEvent, useState } from "react";
import { addMealToDatabase } from "../../store/api-actions";
import { MealType, MealTypeTranslations, SuccessMessages } from "../../const";
import { addNewMeal, setNewMealFormOpened, setStatusMessage } from "../../store/action";
import { Meal } from "../../types/meal";
import { Upload } from "../upload-picture/upload-picture";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

type MealAddingFormProps = {
  type?: MealType;
}

export function MealAddingForm({type}: MealAddingFormProps): JSX.Element {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.data.meals);
  const isFormOpened = useSelector((state: RootState) => state.page.isNewMealFormOpened);
  const mealsAmount = meals.length.toString();
  const [isRecipeAdding, setIsRecipeAdding] = useState(false);

  const formRef = useOutsideClick(() => {
    dispatch(setNewMealFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;

  const defaultData: Meal = {
    id: 'breakfast' + mealsAmount,
    name: "",
    ingredients: [""],
    type: MealType.Breakfast,
    recipe: "",
    picture: "",
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  };

  const getNextId = (meals: Meal[], type: MealType): string => {
    const filteredMeals = meals.filter((meal) => meal.type === type);

    if (filteredMeals.length === 0) {
      return `${type.toLowerCase()}-1`;
    }

    const maxIdNumber = Math.max(
      ...filteredMeals.map((meal) => {
        const idParts = meal.id.split('-');
        return parseInt(idParts[1], 10);
      })
    );

    return `${type.toLowerCase()}-${maxIdNumber + 1}`;
  };

  const [data, setData] = useState<Meal>({
    id: getNextId(meals, MealType.Breakfast),
    name: "",
    ingredients: [""],
    type: MealType.Breakfast,
    recipe: "",
    picture: "",
    calories: 0,
    proteins: 0,
    fats: 0,
    carbs: 0,
  });

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    const newType = value as MealType;

    setData((prevData) => ({
      ...prevData,
      type: newType,
      id: getNextId(meals, newType),
    }));
  };

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    setData((prevdata) => ({
      ...prevdata,
      recipe: value,
    }));
  };

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === "picture" && files) {
      setData((prevdata) => ({
        ...prevdata,
        picture: URL.createObjectURL(files[0]),
      }));
    } else if (name === "ingredients") {
      const ingredientsArray = value
        ? value.split(",").map((ingredient) => ingredient)
        : [];

      setData((prevdata) => ({
        ...prevdata,
        ingredients: ingredientsArray,
      }));
    } else {
      const numericFields = ["calories", "proteins", "fats", "carbs"];
      setData((prevdata) => ({
        ...prevdata,
        [name]:
          numericFields.includes(name) ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addNewMeal({ meal: data }));
    setIsRecipeAdding(true);

    try {
      await addMealToDatabase(data);

      setData({
        ...defaultData,
        id: getNextId(meals, data.type),
      });
      dispatch(setNewMealFormOpened({isOpened: false}));
      dispatch(setStatusMessage({message: SuccessMessages.AddNewMeal}))
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setIsRecipeAdding(false);
    }
  };

  const handleFileUpload = (fileUrl: string) => {
    setData((prevData) => ({
      ...prevData,
      picture: fileUrl,
    }));
  };

  return (
    <form className="form" method="post" action="#" onSubmit={handleFormSubmit} ref={formRef}>
      <button className="button form__button--close" onClick={() => dispatch(setNewMealFormOpened({isOpened: !isFormOpened}))}>x</button>
      <h1 className="title title--2 form__title">Добавление нового блюда</h1>
      <fieldset className="form__fieldset">

        <label className="form__item" htmlFor="meal-type">
          <span>Выберите прием пищи: </span>
          <select
            className="form__input form__input--select"
            name="type"
            id="meal-type"
            value={type ? type : data.type}
            onChange={handleSelectChange}
            required
          >
            {Object.values(MealType).map((type) => (
              <option key={type} value={type}>
                {MealTypeTranslations[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="form__item" htmlFor="meal-name">
          <span>Название блюда: </span>
          <input
            className="form__input"
            type="text"
            id="meal-name"
            name="name"
            value={data.name}
            onChange={handleFieldChange}
            placeholder="Запеченая куриная грудка"
            required
          />
        </label>

        <label className="form__item form__item--wild-grid" htmlFor="meal-ingredients">
          <span>Ингредиенты: </span>
          <input
            className="form__input"
            type="text"
            id="meal-ingredients"
            name="ingredients"
            value={data.ingredients.join(",")} // Преобразуем массив в строку для отображения
            onChange={handleFieldChange}
            placeholder="Куриная грудка, лук, чеснок, специи..."
            required
          />
        </label>

        <label className="form__item form__item--wild-grid" htmlFor="meal-recipe">
          <span>Опиши рецепт (пошагово): </span>
          <textarea
            className="form__input"
            id="meal-recipe"
            name="recipe"
            value={data.recipe}
            onChange={handleTextAreaChange}
            rows={3}
            placeholder="Рецепт..."
          />
        </label>

        <label className="form__item" htmlFor="meal-calories">
          <span>Калории: </span>
          <input
            className="form__input"
            type="number"
            id="meal-calories"
            name="calories"
            value={data.calories}
            onChange={handleFieldChange}
            min={0}
          />
        </label>

        <label className="form__item" htmlFor="meal-proteins">
          <span>Белки: </span>
          <input
            className="form__input"
            type="number"
            id="meal-proteins"
            name="proteins"
            value={data.proteins}
            onChange={handleFieldChange}
            min={0}
          />
        </label>
        <label className="form__item" htmlFor="meal-fats">
          <span>Жиры: </span>
          <input
            className="form__input"
            type="number"
            id="meal-fats"
            name="fats"
            value={data.fats}
            onChange={handleFieldChange}
            min={0}
          />
        </label>
        <label className="form__item" htmlFor="meal-carbs">
          <span>Углеводы: </span>
          <input
            className="form__input"
            type="number"
            id="meal-carbs"
            name="carbs"
            value={data.carbs}
            onChange={handleFieldChange}
            min={0}
          />
        </label>
        <label className="form__item form__item--wild-grid" htmlFor="meal-picture">
          <Upload onFileUpload={handleFileUpload} inputId="meal-picture" name="picture" />
        </label>
      </fieldset>
      <button className="button button--submit" type="submit">
        { isRecipeAdding ? <LoadingSpinner size="40"/> : "Добавить рецепт!"}
      </button>
    </form>
  );
}
