import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/root-reducer"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ActivityLevel, ActivityLevelTranslations, AppRoute, ErrorMessages, Genders, NutritionTarget, PasswordValidationRegex, RegistrationSteps } from "../../const";
import { setStatusMessage, setUserInformation, setUploadedPath, setActiveUser, redirectToRoute, setLoginFormOpened, setRegisterFormOpened, setRegistrationStep } from "../../store/action";
import { addNewUserToDatabase, loginAction } from "../../store/api-actions";
import { setUser } from "../../store/slices/user-slice";
import { Upload } from "../upload-picture/upload-picture";
import { generatePath } from "react-router-dom";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";
import { ReactComponent as Close } from '../../img/icons/cross-icon.svg';
import { useOutsideClick } from "../../hooks/useOutsideClick";

export function RegisterForm(): JSX.Element {
  const usersAmount = useSelector((state: RootState) => state.data.users.length);
  const registrationStep = useSelector((state: RootState) => state.page.registrationStep);

  const dispatch = useDispatch();

  const [isAuthing, setIsAuthing] = useState(false);

  const isFormOpened = useSelector((state: RootState) => state.page.isRegisterFormOpened);

  const formRef = useOutsideClick(() => {
    dispatch(setRegisterFormOpened({ isOpened: false }));
  }) as React.RefObject<HTMLFormElement>;

  const defaultData = {
    id: usersAmount.toString(),
    name: "",
    email: "",
    isAdmin: false,
    mealSchedule: [],
    trainingSessions: [],
    activityLevel: ActivityLevel.Sedentary,
    avatar: "",
    gender: Genders.Male,
    age: 0,
    weight: 0,
    height: 0,
    target: NutritionTarget.WeightMaintenance,
    password: "",
    confirmPassword: "",
  }

  const [data, setData] = useState(defaultData)

  const [userPageLink, setUserPageLink] = useState("");

  const handleFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;

    if (name === 'avatar' && files) {
      setData((prevdata) => ({
        ...prevdata,
        avatar: URL.createObjectURL(files[0]),
      }));
    } else {
      setData((prevdata) => ({
        ...prevdata,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  }

  const closeForms = () => {
    dispatch(setLoginFormOpened({ isOpened: false }));
    dispatch(setRegisterFormOpened({ isOpened: false }));
  }

  useEffect(() => {
    setUserPageLink(generatePath(AppRoute.UserPage, { id: data.id }))
  }, [userPageLink, dispatch, data]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthing(true);
    const auth = getAuth();

    try {
      if (registrationStep === RegistrationSteps.AccountSetup) {
        dispatch(setRegistrationStep({ step: RegistrationSteps.HealthGoals }));
        setIsAuthing(false);
        return;
      }

      if (registrationStep === RegistrationSteps.HealthGoals) {
        if (data.password !== data.confirmPassword) {
          dispatch(setStatusMessage({ message: ErrorMessages.RegisterPasswordNotMatch }));
          setIsAuthing(false);
          return;
        }

        if (!PasswordValidationRegex.test(data.password)) {
          dispatch(setStatusMessage({ message: ErrorMessages.PasswordError }));
          setIsAuthing(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        setData({
          id: user.uid,
          name: data.name,
          email: data.email,
          isAdmin: false,
          mealSchedule: data.mealSchedule,
          trainingSessions: data.trainingSessions,
          avatar: data.avatar,
          password: data.password,
          confirmPassword: data.confirmPassword,
          gender: data.gender,
          age: data.age,
          weight: data.weight,
          height: data.height,
          target: data.target,
          activityLevel: data.activityLevel
        })

        await addNewUserToDatabase({
          id: user.uid,
          name: data.name,
          email: data.email,
          isAdmin: false,
          mealSchedule: data.mealSchedule,
          trainingSessions: data.trainingSessions,
          avatar: data.avatar,
          token,
          gender: data.gender,
          age: data.age,
          weight: data.weight,
          height: data.height,
          target: data.target,
          activityLevel: data.activityLevel
        }, dispatch);

        const userInfo = {
          email: user.email!,
          id: user.uid,
          token,
        };
        dispatch(setUser(userInfo));
        dispatch(setActiveUser({ activeUser: userInfo }));
        loginAction({
          login: data.email,
          password: data.password
        });
        dispatch(setUserInformation({ userInformation: userInfo }));
        dispatch(setUploadedPath({ path: null }));
        localStorage.setItem('nutrition-user', JSON.stringify(userInfo));

        if (userPageLink) {
          dispatch(redirectToRoute(userPageLink as AppRoute));
        }

        dispatch(setRegistrationStep({ step: RegistrationSteps.None }));
        setData(defaultData);
        closeForms();
      }
    } catch (error) {
      console.error('Error registering user:', error);
      dispatch(setStatusMessage({ message: ErrorMessages.HasAccountError }));
    } finally {
      setIsAuthing(false);
    }
  };



  const handleFileUpload = (fileUrl: string) => {
    setData((prevData) => ({
      ...prevData,
      avatar: fileUrl,
    }));
  };

  return (
    <form className="form" action="" method="post" onSubmit={handleRegister} ref={formRef}>
      <div className="form__header">
        <div>
          <h1 className="title title--2">Регистрация</h1>
          <p className="form__register-step-title">{registrationStep}</p>
        </div>
        <button className="button form__button--close" onClick={() => dispatch(setRegisterFormOpened({isOpened: !isFormOpened}))}><Close/></button>
      </div>
      {
        registrationStep === RegistrationSteps.AccountSetup &&
        <fieldset className="form__fieldset">
          <label className="form__item" htmlFor="register-name">
            <span>Имя или ник*: </span>
            <input className="form__input" type="text" name="name" id="register-name" value={data.name} onChange={handleFieldChange} placeholder="Peter" required/>
          </label>
          <label className="form__item" htmlFor="register-email">
            <span>Твой e-mail*: </span>
            <input className="form__input" type="email" name="email" id="register-email" value={data.email} onChange={handleFieldChange} placeholder="peter@yahoo.com" required/>
          </label>
          <label className="form__item form__item--wild-grid" htmlFor="register-avatar">
            <span>Загрузи аватар: </span>
            <Upload onFileUpload={handleFileUpload} inputId="register-avatar" name="avatar"/>
          </label>
          <label className="form__item form__item--wild-grid" htmlFor="register-password">
            <span>Выбери пароль*: </span>
            <input className="form__input" type="password" name="password" id="register-password" value={data.password} onChange={handleFieldChange} autoComplete="off" placeholder="Password" required/>
          </label>
          <label className="form__item form__item--wild-grid" htmlFor="register-confirm-password">
            <span>Подтверди пароль*: </span>
            <input className="form__input" type="password" name="confirmPassword" id="register-confirm-password" value={data.confirmPassword} onChange={handleFieldChange} autoComplete="off" placeholder="Confirm password" required/>
          </label>
        </fieldset>
      }
      {
        registrationStep === RegistrationSteps.HealthGoals &&
        <fieldset className="form__fieldset">
          <label className="form__item" htmlFor="register-gender">
            <span>Пол*: </span>
            <select className="form__input form__input--select" value={data.gender} name="gender" aria-label="choose registration gender:" onChange={handleSelectChange} required>
              {
                Object.values(Genders).map((g) => (
                  <option key={`gender-${g}`} value={g}>{g}</option>
                ))
              }
            </select>
          </label>
          <label className="form__item" htmlFor="register-age">
            <span>Возраст*: </span>
            <input className="form__input" type="number" min="0" max="120" name="age" id="register-age" value={data.age} onChange={handleFieldChange} placeholder="23" required/>
          </label>
          <label className="form__item" htmlFor="register-weight">
            <span>Твой вес*: </span>
            <input className="form__input" type="number" min="0" name="weight" id="register-weight" value={data.weight} onChange={handleFieldChange} required/>
          </label>
          <label className="form__item" htmlFor="register-height">
            <span>Твой рост*: </span>
            <input className="form__input" type="number" min="0" name="height" id="register-height" value={data.height} onChange={handleFieldChange} required/>
          </label>
          <label className="form__item" htmlFor="register-activity">
            <span>Уровень активности*: </span>
            <select className="form__input form__input--select" value={data.activityLevel} name="activityLevel" aria-label="choose activity level:" onChange={handleSelectChange} required>
            {Object.values(ActivityLevel).map((level) => {
              const label = ActivityLevelTranslations[level as keyof typeof ActivityLevelTranslations];
              // Проверяем, если label существует
              if (label) {
                return (
                  <option key={`activity-${level}`} value={level}>
                    {label}
                  </option>
                );
              }
              return null; // Если нет значения, не рендерим <option>
            })}
            </select>
          </label>
          <label className="form__item" htmlFor="register-target">
            <span>Цель программы*: </span>
            <select className="form__input form__input--select" value={data.target} name="target" aria-label="choose nutrition target:" onChange={handleSelectChange} required>
              {
                Object.values(NutritionTarget).map((t) => (
                  <option key={`target-${t}`} value={t}>{t}</option>
                ))
              }
            </select>
          </label>
        </fieldset>
      }
      {
        registrationStep === RegistrationSteps.HealthGoals
        &&
        <button className="button form__submit form__submit--navigation" type="button" onClick={() => dispatch(setRegistrationStep({ step: RegistrationSteps.AccountSetup }))}>Назад</button>
      }
      <button
        className={`button form__submit ${registrationStep === RegistrationSteps.HealthGoals ? 'button--submit' : 'form__submit--navigation'}`}
        type={registrationStep === RegistrationSteps.HealthGoals ? 'submit' : 'button'}
        onClick={handleRegister}
      >
        {
          registrationStep === RegistrationSteps.AccountSetup
          ?
          'Вперед'
          :
            isAuthing
            ?
            <LoadingSpinner color={registrationStep === RegistrationSteps.HealthGoals ? 'white' : 'black'} size={"20"}/>
              :
              'Регистрация!'}
      </button>
      <p className="form__require-description">* - обязательные поля</p>
    </form>
  )
}
