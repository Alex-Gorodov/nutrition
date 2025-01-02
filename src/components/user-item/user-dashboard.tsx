import { useMemo, useState, useEffect } from "react";
import { CaloricGoals, CaloricValues, MacronutrientRatios, Macronutrients, NutritionTargetToCaloricGoals, ScreenSizes } from "../../const";
import { User } from "../../types/user";
import { Ring } from "../ring/ring";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getBasalMetabolicRate } from "../../utils/getBasalMetabolicRate";
import { calculateActiveBmr } from "../../utils/calculateActiveBmr";

type UserItemProps = {
  user: User;
}

export function UserDashboard({user}: UserItemProps): JSX.Element {

  const isMobile = useMediaQuery(ScreenSizes.MobileOnly);

  const userMeals = user.mealSchedule;

  const today = new Date().getDate();

  const todayMeals = userMeals && userMeals.filter((m) => new Date(m[1]).getDate() === today)

  const bmr = getBasalMetabolicRate(user).valueOf();

  const totalCalorieTarget = calculateActiveBmr(bmr, user.activityLevel, user.target);

  const { proteins: proteinRatio, fats: fatRatio, carbs: carbRatio } = MacronutrientRatios[user.target];

  const caloricGoal = CaloricGoals[NutritionTargetToCaloricGoals[user.target]];
  const caloriesTarget = Math.round(totalCalorieTarget * caloricGoal);

  const proteinsTarget = Math.round((caloriesTarget * proteinRatio) / CaloricValues.Proteins);
  const fatsTarget = Math.round((caloriesTarget * fatRatio) / CaloricValues.Fats);
  const carbsTarget = Math.round((caloriesTarget * carbRatio) / CaloricValues.Carbs);

  let calories = 0;
  let proteins = 0;
  let fats = 0;
  let carbs = 0;
  todayMeals && todayMeals.forEach((m) => {
    calories += m[0].calories
    proteins += m[0].proteins
    fats += m[0].fats
    carbs += m[0].carbs
  })

  type FieldType = 'calories' | 'proteins' | 'carbs' | 'fats';

  const initialData = useMemo(() => [
    { field: 'calories', size: isMobile ? 197.5 : 316, gradientId: 'caloriesGradient', strokeColorStart: '#FFF12F', strokeColorEnd: '#FFD700', isMobile: isMobile },
    { field: 'proteins', size: isMobile ? 154.375 : 247, gradientId: 'proteinsGradient', strokeColorStart: '#F6337A', strokeColorEnd: '#F71046', isMobile: isMobile },
    { field: 'carbs', size: isMobile ? 111.25 : 178, gradientId: 'carbsGradient', strokeColorStart: '#15C2E0', strokeColorEnd: '#1EF8D5', isMobile: isMobile },
    { field: 'fats', size: isMobile ? 68.125 : 109, gradientId: 'fatsGradient', strokeColorStart: '#B1FD36', strokeColorEnd: '#6FE430', isMobile: isMobile },
  ] as { field: FieldType; size: number; gradientId: string; strokeColorStart: string; strokeColorEnd: string, isMobile: boolean }[], [isMobile]);

  const targetMap = useMemo(
    () => ({
      calories: caloriesTarget,
      proteins: proteinsTarget,
      carbs: carbsTarget,
      fats: fatsTarget,
    }),
    [caloriesTarget, proteinsTarget, carbsTarget, fatsTarget]
  );

  const valueMap = useMemo(
    () => ({
      calories,
      proteins,
      carbs,
      fats,
    }),
    [calories, proteins, carbs, fats]
  );

  const [data, setData] = useState(initialData.map((item) => ({
    ...item,
    target: targetMap[item.field],
    value: valueMap[item.field],
  })));

  useEffect(() => {
    setData(initialData.map((item) => ({
      ...item,
      target: targetMap[item.field],
      value: valueMap[item.field],
    })));
  }, [caloriesTarget, calories, proteinsTarget, proteins, carbsTarget, carbs, fatsTarget, fats, initialData, targetMap, valueMap]);

  return (
    user
    &&
    <div className="dashboard">
      <div className="ring-wrapper">
        {data.map((ring) => (
          <Ring key={ring.field} {...ring} />
        ))}
      </div>
      <div className="info-wrapper">
        {data.map((ring) => (
          <div className="info" key={`${ring.field}`} id={`${ring.field}Value`}>
            <span className="info__name">{Macronutrients[ring.field.charAt(0).toUpperCase() + ring.field.slice(1) as keyof typeof Macronutrients]}</span>
            <p className="info__accent" style={{ color: ring.strokeColorEnd }}>{ring.value}/<span>{ring.target}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
