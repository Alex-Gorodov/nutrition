export enum AppRoute {
  Root = "/nutrition",
  UserPage = "nutrition/user/:id"
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

export enum ScreenSizes {
  Mobile = 430,
  MobileOnly = 768,
  Tablet = 1024,
  Desktop = 1440,
  ContainerMaxWidth = 1250
}

export const PasswordValidationRegex = /^(?=.*\d).{8,}$/;

export enum ErrorMessages {
  PasswordError = 'Password must have at least one letter, one number, and be 8+ characters long.',
  NotificationError = 'Please sign in or register to add items to get notification.',
  AuthError = 'Invalid username or password. Please try again.',
  RegisterEmptyFields = 'Fill the required fields, please.',
  RegisterPasswordNotMatch = 'Passwords do not match.',
  EmailError = 'Please enter correct e-mail.',
  LikeError = "Please sign in or register to like this post."
};

export enum SuccessMessages {
  AddToPreOrder = "Item successfully added to your pre-order list!",
  AddToCart = "Item successfully added to your cart!",
  Subscription = "Thank You for Subscribing!",
  CopiedToClipboard = "Copied to clipboard!",
};

export enum AuthorizationStatus {
  Unknown = 'UNKNOWN',
  NoAuth = 'NO_AUTH',
  Auth = 'AUTH',
}
