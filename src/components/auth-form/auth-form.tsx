import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthorizationStatus, ErrorMessages } from "../../const";
import { useDispatch } from "react-redux";
import { loginAction } from "../../store/api-actions";
import { ChangeEvent, useRef, useState } from "react";
import { AppDispatch } from "../../types/state";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { setUser } from "../../store/slices/user-slice";
import { requireAuthorization, setActiveUser, setStatusMessage, setUserInformation } from "../../store/action";
import { RegisterForm } from "../register-form/register-form";

type FormProps = {
  value: string;
  error: boolean;
  errorValue: string;
  regexp: RegExp;
};

type dataProps = {
  [key: string]: FormProps;
};

type AuthFormProps = {
  className?: string;
}

export function AuthForm({className}: AuthFormProps): JSX.Element {

  const dispatch = useDispatch<AppDispatch>();

  const [isAuthing, setIsAuthing] = useState(false);

  const [isRegistrationFormOpened, setRegistrationFormOpened] = useState(false);

  const initialData: dataProps = {
    email: {
      value: '',
      error: false,
      errorValue: ErrorMessages.EmailError,
      regexp: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    },
    password: {
      value: '',
      error: false,
      errorValue: ErrorMessages.PasswordError,
      regexp: /(?=.*[0-9])(?=.*[A-Za-z])[A-Za-z0-9]{2,}/,
    }
  };

  const [data, setData] = useState<dataProps>(initialData);

  const handleFieldChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = target;
    const isValidField = data[name].regexp.test(value);

    if (!isValidField) {
      target.setCustomValidity(data[name].errorValue);
    } else {
      target.setCustomValidity('');
    }

    setData({
      ...data,
      [name]: {
        ...data[name],
        value,
        error: !isValidField,
      },
    });
  };

  const loginRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthing(true);
    const auth = getAuth();

    try {
      const { user } = await signInWithEmailAndPassword(auth, data.email.value, data.password.value);
      const token = await user.getIdToken();
      const userInfo = {
        email: user.email!,
        id: user.uid,
        token: token
      };
      localStorage.setItem('nutrition-user', JSON.stringify(userInfo));

      const authData = {
        login: loginRef.current?.value || "",
        password: passwordRef.current?.value || "",
      };
      dispatch(setUser(userInfo));
      dispatch(requireAuthorization({ authorizationStatus: AuthorizationStatus.Auth }));
      dispatch(setUserInformation({ userInformation: userInfo }));
      dispatch(setActiveUser({activeUser: userInfo}));
      dispatch(loginAction(authData));
    } catch (error) {
      dispatch(setStatusMessage({message: ErrorMessages.AuthError}));
      setData(initialData);
      console.error(error);
    } finally {
      setIsAuthing(false);
    }
  };

  return (
    <div className="form__wrapper ">
      <form className={`login__form form ${className}`} action="#" method="post" onSubmit={handleLogin}>
        <h3 className="title title--3 form__title">Sign in</h3>
        {
          <>
            <div className="form__input-wrapper">
              <label className="form__item" htmlFor="login-name">
                <input
                  className="form__input"
                  type="email"
                  name="email"
                  placeholder=""
                  id="login-name"
                  ref={loginRef}
                  required
                  value={data.email.value}
                  onChange={handleFieldChange}
                />
                <span className="form__label form__label--sign-in">E-mail:</span>
              </label>
            </div>
            <div className="form__input-wrapper">
              <label className="form__item" htmlFor="login-password">
                <input
                  className="form__input"
                  type="password"
                  name="password"
                  placeholder=""
                  id="login-password"
                  ref={passwordRef}
                  required
                  value={data.password.value}
                  onChange={handleFieldChange}
                />
                <span className="form__label form__label--sign-in">Password:</span>
              </label>
            </div>
            <div className="form__buttons">
              <button className="login__submit form__submit button" type="submit" disabled={isAuthing}>
                {isAuthing
                  ? <LoadingSpinner size={"16"}/>
                  : 'Sign in'}
              </button>
              <p>Have not account yet?</p>
              <button
                className="button"
                type="button"
                onClick={() => setRegistrationFormOpened(!isRegistrationFormOpened)}
              >Sign up</button>
            </div>
          </>
        }
      </form>
      {
        isRegistrationFormOpened && <RegisterForm/>
      }
    </div>
  )
}
