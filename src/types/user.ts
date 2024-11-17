import { Meal } from "./meal";

export type User = {
  id: string;
  name: string,
  email: string,
  token: string,
  phone: string,
  password: string,
  isAdmin: boolean,
  liked: Meal[],
  avatar: string,
};

export type RegisterUser = User & {
  confirmPassword: string;
}
