export enum AppRoute {
  Root = "/nutrition",
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
    veryFast: { intensity: "Очень высоко", speed: 7.3, met: 6.3 },
  },
  Running: {
    slow: { intensity: "", speed: 8.0, met: 8.3 },
    moderate: { intensity: "Средне", speed: 10.0, met: 9.8 },
    fast: { intensity: "Высоко", speed: 12.0, met: 11.5 },
  },
  Swimming: {
    low: { intensity: "Низко", met: 6.0 },
    moderate: { intensity: "Средне", met: 8.0 },
    high: { intensity: "Высоко", met: 10.0 },
  },
  Cardio: {
    low: { intensity: "Низко", met: 6.0 },
    moderate: { intensity: "Средне", met: 8.0 },
    high: { intensity: "Высоко", met: 10.0 },
  },
  Gym: {
    low: { intensity: "Низко", met: 6.0 },
    moderate: { intensity: "Средне", met: 8.0 },
    high: { intensity: "Высоко", met: 10.0 },
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

export enum Genders {
  Male = 'мужской',
  Female = 'женский',
}

export enum NutritionTarget {
  WeightMaintenance = 'Поддержание веса',
  WeightLoss = 'Похудение',
  MuscleGain = 'Набор массы',
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
  PasswordError = 'Password must have at least one letter, one number, and be 8+ characters long.',
  TrainingNoAuthError = 'Please sign in or register to add training.',
  MealNoAuthError = 'Please sign in or register to add meal.',
  AuthError = 'Invalid username or password. Please try again.',
  RegisterEmptyFields = 'Fill the required fields, please.',
  RegisterPasswordNotMatch = 'Passwords do not match.',
  EmailError = 'Please enter correct e-mail.',
  HasAccountError = "This email is already registered. Please login with your mail + password pair or check your e-mail correctness.",
  ConnectionError = "Connection error. Check your internet connection and try again."
};

export enum SuccessMessages {
  AddNewMeal = "Ваш рецепт добавлен в базу!",
  TrainingAdded = "Training successfully added to your list!",
  Subscription = "Thank You for Subscribing!",
  CopiedToClipboard = "Copied to clipboard!",
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
