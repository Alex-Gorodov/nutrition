import { UserAuthData } from "../types/user-auth-data";

const AUTH_TOKEN_KEY_NAME = 'braga-user';

export type Token = string;

export const getToken = (): Token => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY_NAME);
  return token ?? '';
};

export const saveToken = (token: Token): void => {
  localStorage.setItem(AUTH_TOKEN_KEY_NAME, token);
};

export const dropToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
};

export const saveUserToLocalStorage = (user: UserAuthData) => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY_NAME, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage', error);
  }
};

export const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem(AUTH_TOKEN_KEY_NAME);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error retrieving user from localStorage', error);
    return null;
  }
};

export const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY_NAME);
  } catch (error) {
    console.error('Error removing user from localStorage', error);
  }
};
