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
  requireAuthorization,
  setActiveUser,
  setLoginFormOpened,
  setRegisterFormOpened,
  setStatusMessage,
  setUploadedPath,
  setUsersDataLoading,
} from "../../store/action";
import { RootState } from "../../store/root-reducer";
import { AuthorizationStatus, ErrorMessages } from "../../const";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { addNewUserToDatabase, loginAction } from "../../store/api-actions";

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
  const [isAuthing, setIsAuthing] = useState(false);

  const users = useSelector((state: RootState) => state.data.users);

  const checkIfUserExists = async (email: string): Promise<boolean> => {
    return users.find((u) => u.email === email)?.email === email;
  };

  const isLoginFormOpened = useSelector(
    (state: RootState) => state.page.isLoginFormOpened
  );
  const isRegistrationFormOpened = useSelector(
    (state: RootState) => state.page.isRegisterFormOpened
  );

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
      regexp: /(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]{2,}/,
    },
  };

  const [data, setData] = useState<FormData>(initialData);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthing(true);

    const auth = getAuth();
    const { email, password } = data;

    if (email.error || password.error) {
      dispatch(setStatusMessage({ message: ErrorMessages.AuthError }));
      setIsAuthing(false);
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
      localStorage.setItem("nutrition-user", JSON.stringify(userInfo));

      if (await checkIfUserExists(userInfo.email)) {
        dispatch(setUser(userInfo));
        dispatch(
          requireAuthorization({ authorizationStatus: AuthorizationStatus.Auth })
        );
        setIsAuthing(false);
        closeForms();
      } else {
        dispatch(setStatusMessage({message: ErrorMessages.HasAccountError}));
        setIsAuthing(false);
      }
    } catch (error) {
      dispatch(setStatusMessage({message: ErrorMessages.AuthError}));
      console.error("Login error:", error);
    } finally {
      setIsAuthing(false);
    }
  };

  const handleOpenRegister = () => {
    dispatch(setLoginFormOpened({ isOpened: !isLoginFormOpened }));
    dispatch(setRegisterFormOpened({ isOpened: !isRegistrationFormOpened }));
  };

  const closeForms = () => {
    dispatch(setLoginFormOpened({ isOpened: false }));
    dispatch(setRegisterFormOpened({ isOpened: false }));
  }

  const handleGoogleSignIn = async () => {
    setIsAuthing(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Google account email not found");
      }

      const existingUser = await checkIfUserExists(user.email);

      if (existingUser) {
        try {
          const { user: existingFirebaseUser } = await signInWithEmailAndPassword(
            auth,
            user.email,
            "user-password" // Здесь нужно получить пароль, например, запросом к пользователю
          );

          const token = await existingFirebaseUser.getIdToken();
          const userInfo = {
            email: existingFirebaseUser.email!,
            id: existingFirebaseUser.uid,
            token,
          };

          localStorage.setItem("nutrition-user", JSON.stringify(userInfo));
          dispatch(setUser(userInfo));
          dispatch(setActiveUser({ activeUser: userInfo }));
        } catch (authError) {
          dispatch(setStatusMessage({message: ErrorMessages.HasAccountError}))
          console.error("Error signing in with existing user:", authError);
        }
      } else {
        const name = user.displayName || "Unknown";
        const avatar = user.photoURL || "";
        const token = await user.getIdToken();

        await addNewUserToDatabase(
          {
            id: user.uid,
            name: name,
            email: user.email,
            isAdmin: false,
            liked: [],
            avatar: avatar,
            token,
          },
          dispatch
        );
      }

      dispatch(setUploadedPath({ path: null }));
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      alert("Ошибка при авторизации через Google: " + error);
    } finally {
      setIsAuthing(false);
      closeForms();
    }
  };

  return (
    <div className="form__wrapper">
      <form className={`form login__form ${className}`} onSubmit={handleLogin}>
        <h3 className="title title--3 form__title">Войти</h3>
        {Object.keys(data).map((fieldName) => {
          const field = data[fieldName];
          return (
            <label
              key={fieldName}
              className="form__item"
              htmlFor={`login-${fieldName}`}
            >
              <span className="form__label form__label--sign-in">
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
              />
              {field.error && (
                <span className="form__error">{field.errorValue}</span>
              )}
            </label>
          );
        })}
        <div className="form__buttons">
          <button
            className="login__submit form__submit button"
            type="submit"
            disabled={isAuthing}
          >
            {isAuthing ? <LoadingSpinner size="16" /> : "Sign in"}
          </button>
          <button
            className="button button--google"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isAuthing}
          >
            Sign in with Google
          </button>
        </div>
        <div className="form__buttons form__buttons--column">
          <p>Еще нет аккаунта?</p>
          <button
            className="button"
            type="button"
            onClick={handleOpenRegister}
          >
            Регистрация
          </button>
        </div>
      </form>
    </div>
  );
}
