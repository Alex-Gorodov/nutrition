export enum AppRoute {
  Landing = "/nutrition",
  Root = "/nutrition/home",
  UserPage = "/nutrition/user/:id",
  MealPage = "/nutrition/meal/:id",
  MealsByTypePage = "/nutrition/meals/:type",
}

export enum APIRoute {
  Meals = 'nutrition-db/meals',
  Users = 'nutrition-db/users',
  Login = 'nutrition-db/login',
}

export enum MealType {
  Breakfast = "Breakfast",
  Lunch = "Lunch",
  Dinner = "Dinner",
  Snack = "Snack"
}

export const MealTypeTranslations: Record<MealType, string> = {
  [MealType.Breakfast]: "Завтрак",
  [MealType.Lunch]: "Обед",
  [MealType.Dinner]: "Ужин",
  [MealType.Snack]: "Перекус"
};

export enum TrainingType {
  Walking = "Walking",
  Running = "Running",
  Cardio = "Cardio",
  Gym = "Gym",
  Swimming = "Swimming",
}

export const TrainingTypeTranslations: Record<TrainingType, string> = {
  [TrainingType.Walking]: "Ходьба",
  [TrainingType.Running]: "Бег",
  [TrainingType.Cardio]: "Кардио",
  [TrainingType.Gym]: "Спортзал",
  [TrainingType.Swimming]: "Плавание"
}

export type TrainingSession = {
  activity: TrainingType;
  date: Date;
  duration: number;
  caloriesBurned: number;
};

export enum BasicTrainingCaloriesPerHour {
  Walking = 250,
  Running = 600,
  Cardio = 500,
  Gym = 400,
  Swimming = 700
}

export const MET_VALUES = {
  Walking: {
    slow: { intensity: "Низко", speed: 3.2, met: 2.0 },
    moderate: { intensity: "Средне", speed: 5.0, met: 3.5 },
    fast: { intensity: "Высоко", speed: 6.4, met: 5.0 },
    veryFast: { intensity: "Очень высоко", speed: 8.0, met: 6.3 },  // Добавлено
  },
  Running: {
    slow: { intensity: "Низко", speed: 8.0, met: 8.3 },
    moderate: { intensity: "Средне", speed: 10.0, met: 9.8 },
    fast: { intensity: "Высоко", speed: 12.0, met: 11.5 },
    veryFast: { intensity: "Очень высоко", speed: 14.0, met: 13.0 },  // Добавлено
  },
  Swimming: {
    low: { intensity: "Низко", met: 6.0 },
    moderate: { intensity: "Средне", met: 8.0 },
    high: { intensity: "Высоко", met: 10.0 },
    veryHigh: { intensity: "Очень высоко", met: 12.0 }, // Для плавания оставляем veryHigh
  },
  Cardio: {
    low: { intensity: "Низко", met: 3.0 },
    moderate: { intensity: "Средне", met: 6.0 },
    high: { intensity: "Высоко", met: 8.0 },
    veryHigh: { intensity: "Очень высоко", met: 10.0 },  // Добавлено
  },
  Gym: {
    low: { intensity: "Низко", met: 3.5 },
    moderate: { intensity: "Средне", met: 5.5 },
    high: { intensity: "Высоко", met: 8.0 },
    veryHigh: { intensity: "Очень высоко", met: 10.0 },  // Добавлено
  },
} as const;



export type METActivity = keyof typeof MET_VALUES;
export type METIntensity = "slow" | "moderate" | "fast" | "low" | "high";

export enum TrainingIntensity {
  Slow = "Slow",
  Low = "Low",
  Moderate = "Moderate",
  High = "High",
  Fast = "Fast"
}

export const TrainingIntensityTranslation: Record<TrainingIntensity, string> = {
  [TrainingIntensity.Slow]: "Медленно",
  [TrainingIntensity.Low]: "Низко",
  [TrainingIntensity.Moderate]: "Средне",
  [TrainingIntensity.High]: "Высоко",
  [TrainingIntensity.Fast]: "Быстро",
}

export enum ActivityLevel {
  Sedentary = 1.2,
  LightlyActive = 1.375,
  ModeratelyActive = 1.55,
  VeryActive = 1.725,
  ExtraActive = 1.9,
}

export const ActivityLevelTranslations: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]: 'Малая подвижность',
  [ActivityLevel.LightlyActive]: 'Низкая активность',
  [ActivityLevel.ModeratelyActive]: 'Умеренная активность',
  [ActivityLevel.VeryActive]: 'Высокая активность',
  [ActivityLevel.ExtraActive]: 'Очень высокая активность',
}

export enum NutritionTarget {
  WeightMaintenance = 'Поддержание веса',
  WeightLoss = 'Похудение',
  MuscleGain = 'Набор массы',
}

export enum CaloricGoals {
  WeightLoss = 0.85,
  WeightMaintenance = 1,
  MuscleGain = 1.15,
}

export enum CaloricValues {
  Proteins = 4,
  Fats = 9,
  Carbs = 4,
}

export const NutritionTargetToCaloricGoals: Record<NutritionTarget, keyof typeof CaloricGoals> = {
  [NutritionTarget.WeightMaintenance]: 'WeightMaintenance',
  [NutritionTarget.WeightLoss]: 'WeightLoss',
  [NutritionTarget.MuscleGain]: 'MuscleGain',
};

export const MacronutrientRatios = {
  [NutritionTarget.WeightMaintenance]: { proteins: 0.3, fats: 0.3, carbs: 0.4 },
  [NutritionTarget.WeightLoss]: { proteins: 0.4, fats: 0.25, carbs: 0.35 },
  [NutritionTarget.MuscleGain]: { proteins: 0.35, fats: 0.25, carbs: 0.4 },
};


export enum Genders {
  Male = 'мужской',
  Female = 'женский',
}

export enum RegistrationSteps {
  None = 'None',
  AccountSetup = "Настройка аккаунта",
  HealthGoals = "Данные о здоровье",
}

export enum ScreenSizes {
  Mobile = 490,
  MobileOnly = 768,
  Tablet = 1024,
  Desktop = 1440,
  ContainerMaxWidth = 1250
}

export const PasswordValidationRegex = /^(?=.*\d).{8,}$/;

export enum ErrorMessages {
  PasswordError = 'Пароль должен содержать хотя бы одну букву, одну цифру и быть длиной не менее 8 символов.',
  TrainingNoAuthError = 'Пожалуйста, войди в систему или зарегистрируйтесь, чтобы добавить тренировку.',
  MealNoAuthError = 'Пожалуйста, войди в систему или зарегистрируйтесь, чтобы добавить прием пищи.',
  AuthError = 'Неправильное имя пользователя или пароль. Пожалуйста, попробуй еще раз.',
  RegisterEmptyFields = 'Пожалуйста, заполни обязательные поля.',
  RegisterPasswordNotMatch = 'Пароли не совпадают.',
  EmailError = 'Пожалуйста, введи корректный адрес электронной почты.',
  HasAccountError = "Эта почта уже зарегистрирована. Пожалуйста, войди с вашей парой почта + пароль или проверь правильность почты.",
  ConnectionError = "Ошибка соединения. Проверь ваше интернет-соединение и попробуй снова."
};

export enum SuccessMessages {
  AddNewMeal = "Ваш рецепт добавлен в базу.",
  AddMeal = "Блюдо успешно добавлено.",
  TrainingAdded = "Тренировка успешно добавлена в ваш список.",

};

export enum AuthorizationStatus {
  Unknown = 'UNKNOWN',
  NoAuth = 'NO_AUTH',
  Auth = 'AUTH',
}

export enum Months {
  Январь,
  Февраль,
  Март,
  Апрель,
  Май,
  Июнь,
  Июль,
  Август,
  Сентябрь,
  Октябрь,
  Ноябрь,
  Декабрь
}
