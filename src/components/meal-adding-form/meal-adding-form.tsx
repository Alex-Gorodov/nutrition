import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/root-reducer"
import { ChangeEvent, FormEvent, useState } from "react";
import { addMealToDatabase } from "../../store/api-actions";
import { MealType } from "../../const";
import { addNewMeal } from "../../store/action";
import { Meal } from "../../types/meal";
import { Upload } from "../upload-picture/upload-picture";

export function MealAddingForm(): JSX.Element {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.data.meals);
  const mealsAmount = meals.length.toString();

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
  }

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
      recipe: value
    }))
  }

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === 'picture' && files) {
      setData((prevdata) => ({
        ...prevdata,
        avatar: URL.createObjectURL(files[0]),
      }));
    } else if (name === 'ingredients') {
      const ingredientsArray = value.split(',').map((ingredient) => ingredient);

      setData((prevdata) => ({
        ...prevdata,
        ingredients: ingredientsArray,
      }));
    } else {
      const numericFields = ['calories', 'proteins', 'fats', 'carbs'];
      setData((prevdata) => ({
        ...prevdata,
        [name]: numericFields.includes(name) ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addNewMeal({ meal: data }));
    addMealToDatabase(data);

    setData({
      ...defaultData,
      id: getNextId(meals, MealType.Breakfast),
    });
  };

  const handleFileUpload = (fileUrl: string) => {
    setData((prevData) => ({
      ...prevData,
      picture: fileUrl,
    }));
  };

  return (
    <form method="post" action="#" onSubmit={handleFormSubmit}>
      <h1 className="title title--2">Add new meal</h1>
      <fieldset>
        <label htmlFor="meal-type">
          <span>Choose meal type: </span>
          <select name="type" id="meal-type" value={data.type} onChange={handleSelectChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>
        </label>
        <label htmlFor="meal-name">
          <span>Enter meal name: </span>
          <input type="text" id="meal-name" name="name" value={data.name} onChange={handleFieldChange} placeholder="Chicken breast"/>
        </label>
        <label htmlFor="meal-ingredients">
          <span>Enter meal ingredients: </span>
          <input type="text" id="meal-ingredients" name="ingredients" value={data.ingredients} onChange={handleFieldChange} placeholder="Chicken breast, onion, garlic, spices"/>
        </label>
        <label htmlFor="meal-recipe">
          <span>Enter recipe steps (description): </span>
          <textarea id="meal-recipe" name="recipe" value={data.recipe} onChange={handleTextAreaChange} placeholder="Recipe..."/>
        </label>
        <label htmlFor="meal-calories">
          <span>Calories: </span>
          <input type="number" id="meal-calories" name="calories" value={data.calories} onChange={handleFieldChange} min={0}/>
        </label>
        <label htmlFor="meal-proteins">
          <span>Proteins: </span>
          <input type="number" id="meal-proteins" name="proteins" value={data.proteins} onChange={handleFieldChange} min={0}/>
        </label>
        <label htmlFor="meal-fats">
          <span>Fats: </span>
          <input type="number" id="meal-fats" name="fats" value={data.fats} onChange={handleFieldChange} min={0}/>
        </label>
        <label htmlFor="meal-carbs">
          <span>Carbs: </span>
          <input type="number" id="meal-carbs" name="carbs" value={data.carbs} onChange={handleFieldChange} min={0}/>
        </label>
        <label htmlFor="meal-picture">
          <Upload onFileUpload={handleFileUpload} inputId="meal-picture" name="picture"/>
        </label>
      </fieldset>
      <button className="button" type="submit">Add recipe!</button>
    </form>
  )
}
