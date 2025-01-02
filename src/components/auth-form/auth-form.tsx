import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useState } from "react";
import { AppDispatch } from "../../types/state";
import { setUser } from "../../store/slices/user-slice";
import {
  redirectToRoute,
  requireAuthorization,
  setLoginFormOpened,
  setRegisterFormOpened,
  setRegistrationStep,
  setStatusMessage,
  setUserInformation,
} from "../../store/action";
import { RootState } from "../../store/root-reducer";
import {
  ActivityLevel,
  AppRoute,
  AuthorizationStatus,
  ErrorMessages,
  Genders,
  NutritionTarget,
  RegistrationSteps
} from "../../const";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { addNewUserToDatabase, loginAction } from "../../store/api-actions";
import { ReactComponent as Google } from "../../img/icons/google-icon.svg";
import { checkAuthMethod } from "../../utils/checkAuthMethod";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { ReactComponent as Close } from '../../img/icons/cross-icon.svg';

type FormField = {
  value: string;
  error: boolean;
  errorValue: string;
  regexp: RegExp;
};

type FormData = Record<string, FormField>;

type AuthFormProps = {
  className?: string;
};

export function AuthForm({ className }: AuthFormProps): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [isEmailAuthing, setIsEmailAuthing] = useState(false);
  const [isGoogleAuthing, setIsGoogleAuthing] = useState(false);

  const isFormOpened = useSelector((state: RootState) => state.page.isLoginFormOpened);

  const formRef = useOutsideClick(() => {
    dispatch(setLoginFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;

  const isAuth = useSelector((state:RootState) => state.auth.authorizationStatus) === AuthorizationStatus.Auth;

  const initialData: FormData = {
    email: {
      value: "",
      error: false,
      errorValue: ErrorMessages.EmailError,
      regexp: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    },
    password: {
      value: "",
      error: false,
      errorValue: ErrorMessages.PasswordError,
      regexp: /(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]{6,}/,
    },
  };

  const [data, setData] = useState<FormData>(initialData);

  const users = useSelector((state: RootState) => state.data.users);

  const handleFieldChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = target;
    const field = data[name];

    setData({
      ...data,
      [name]: {
        ...field,
        value,
        error: !field.regexp.test(value),
      },
    });
  };

  const checkIfUserExists = (email: string) => {
    return users.some((u) => u.email === email);
  };

  const closeForms = () => {
    dispatch(setLoginFormOpened({ isOpened: false }));
    dispatch(setRegisterFormOpened({ isOpened: false }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailAuthing(true);

    const auth = getAuth();
    const { email, password } = data;

    checkAuthMethod();

    if (email.error || password.error) {
      dispatch(setStatusMessage({ message: ErrorMessages.AuthError }));
      setIsEmailAuthing(false);
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      const token = await user.getIdToken();
      const userInfo = { email: user.email!, id: user.uid, token };

      if (checkIfUserExists(userInfo.email)) {
        localStorage.setItem("nutrition-user", JSON.stringify(userInfo));
        dispatch(setUser(userInfo));
        dispatch(
          requireAuthorization({ authorizationStatus: AuthorizationStatus.Auth })
        );
        dispatch(setUserInformation({ userInformation: userInfo }));
        loginAction({
          login: email.value,
          password: password.value
        });
        closeForms();
      } else if (await checkAuthMethod() === "Google") {
        dispatch(setStatusMessage({ message: ErrorMessages.HasAccountError }));
      }
    } catch (error: any) {
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        dispatch(setStatusMessage({ message: ErrorMessages.AuthError }));
      } else {
        dispatch(setStatusMessage({ message: ErrorMessages.ConnectionError }));
      }
      console.error("Login error:", error);
    } finally {
      isAuth && dispatch(redirectToRoute(AppRoute.Root))
      setIsEmailAuthing(false);
    }
  };


  const handleGoogleSignIn = async () => {
    setIsGoogleAuthing(true);

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account email not found");
      }

      const token = await user.getIdToken();
      const userInfo = {
        email: user.email!,
        id: user.uid,
        token,
      };

      if (checkIfUserExists(user.email)) {
        localStorage.setItem("nutrition-user", JSON.stringify(userInfo));
        dispatch(setUser(userInfo));
      } else {
        const name = user.displayName || "Unknown";
        const avatar = user.photoURL || "";

        await addNewUserToDatabase(
          {
            id: user.uid,
            name,
            email: user.email!,
            isAdmin: false,
            mealSchedule: [],
            trainingSessions: [],
            avatar: avatar,
            token,
            gender: Genders.Male,
            age: 0,
            weight: 0,
            target: NutritionTarget.WeightMaintenance,
            height: 0,
            activityLevel: ActivityLevel.Sedentary
          },
          dispatch
        );
      }

      dispatch(
        requireAuthorization({ authorizationStatus: AuthorizationStatus.Auth })
      );
      closeForms();
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      dispatch(setStatusMessage({ message: ErrorMessages.AuthError }));
    } finally {
      isAuth && dispatch(redirectToRoute(AppRoute.Root))
      setIsGoogleAuthing(false);
    }
  };

  const handleOpenRegister = () => {
    dispatch(setLoginFormOpened({ isOpened: false }));
    dispatch(setRegisterFormOpened({ isOpened: true }));
    dispatch(setRegistrationStep({step: RegistrationSteps.AccountSetup}))
  };

  return (
    <div className="form__wrapper">
      <form className={`form login__form ${className}`} onSubmit={handleLogin} autoComplete="off" ref={formRef}>
        <div className="form__header">
          <h3 className="title title--3 form__title">Войти</h3>
          <button className="button form__button--close" onClick={() => dispatch(setLoginFormOpened({isOpened: !isFormOpened}))}><Close/></button>
        </div>
        <fieldset className="form__fieldset form__fieldset--no-grid">

          {Object.keys(data).map((fieldName) => {
            const field = data[fieldName];
            return (
              <label
                key={fieldName}
                className="form__item"
                htmlFor={`login-${fieldName}`}
              >
                <span className="form__label">
                  {fieldName === "email" ? "E-mail:" : "Пароль:"}
                </span>
                <input
                  className={`form__input ${field.error ? "input--error" : ""}`}
                  type={fieldName === "email" ? "email" : "password"}
                  name={fieldName}
                  id={`login-${fieldName}`}
                  required
                  value={field.value}
                  onChange={handleFieldChange}
                  autoComplete={fieldName === "password" ? "off" : "on"}
                />
                {field.error && (
                  <p className="form__message">{field.errorValue}</p>
                )}
              </label>
            );
          })}
          <div className="form__buttons">
            <button
              className="button button--submit"
              type="submit"
              disabled={isGoogleAuthing}
            >
              {isEmailAuthing ? <LoadingSpinner color="white" size="16" /> : "Войти"}
            </button>
            <button
              className="button button--google"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isEmailAuthing}
            >
              {isGoogleAuthing ? <LoadingSpinner color="white" size="16" /> :  <>Войти с <Google/></>}
            </button>
          </div>
          <div className="form__buttons form__buttons--column">
            <p>Еще нет аккаунта?</p>
            <button
              className="button"
              type="button"
              onClick={handleOpenRegister}
              disabled={isEmailAuthing || isGoogleAuthing}
            >
              Регистрация
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
