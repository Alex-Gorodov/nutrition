import { ChangeEvent, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/root-reducer"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ActivityLevel, ActivityLevelTranslations, AppRoute, ErrorMessages, Genders, NutritionTarget, PasswordValidationRegex, RegistrationSteps } from "../../const";
import { setStatusMessage, setUserInformation, setUploadedPath, setActiveUser, redirectToRoute, setLoginFormOpened, setRegisterFormOpened, setRegistrationStep } from "../../store/action";
import { addNewUserToDatabase, loginAction } from "../../store/api-actions";
import { setUser } from "../../store/slices/user-slice";
import { Upload } from "../upload-picture/upload-picture";
import { generatePath } from "react-router-dom";
import { useGetUser } from "../../hooks/useGetUser";
import { LoadingSpinner } from "../loading-spinner/loading-spinner";

export function RegisterForm(): JSX.Element {
  const usersAmount = useSelector((state: RootState) => state.data.users.length);
  const registrationStep = useSelector((state: RootState) => state.data.registrationStep);

  const dispatch = useDispatch();

  const [isAuthing, setIsAuthing] = useState(false);

  const defaultData = {
    id: usersAmount,
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

  const closeForms = () => {
    dispatch(setLoginFormOpened({ isOpened: false }));
    dispatch(setRegisterFormOpened({ isOpened: false }));
  }

  const user = useGetUser();

  const link = generatePath(AppRoute.UserPage, {
    id: `${user?.id}`,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthing(true);
    const auth = getAuth();

    try {
      if (registrationStep === RegistrationSteps.AccountSetup) {
        // Переход к следующему шагу
        dispatch(setRegistrationStep({ step: RegistrationSteps.HealthGoals }));
        setIsAuthing(false);
        return;
      }

      if (registrationStep === RegistrationSteps.HealthGoals) {
        // Валидация пароля
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

        // Регистрация пользователя
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        await addNewUserToDatabase({
          id: user.uid,
          name: data.name,
          email: data.email,
          isAdmin: false,
          mealSchedule: [],
          trainingSessions: [],
          avatar: data.avatar,
          token,
          gender: data.gender,
          age: data.age,
          weight: data.weight,
          height: data.height,
          target: data.target,
          activityLevel: ActivityLevel.Sedentary
        }, dispatch);

        // Сохранение данных пользователя
        const userInfo = {
          email: user.email!,
          id: user.uid,
          token,
        };
        dispatch(setUser(userInfo));
        dispatch(setActiveUser({ activeUser: userInfo }));
        dispatch(setUploadedPath({ path: null }));
        localStorage.setItem('nutrition-user', JSON.stringify(userInfo));

        // Перенаправление на страницу пользователя
        dispatch(redirectToRoute(link as AppRoute));
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
    <form className="form" action="" method="post" onSubmit={handleRegister}>
      <h1 className="title title--2">{registrationStep}</h1>
      <p>* - обязательные поля</p>
      {
        registrationStep === RegistrationSteps.AccountSetup &&
        <fieldset className="form__fieldset">
          <label className="form__item" htmlFor="register-name">
            <span>Имя или ник*: </span>
            <input className="form__input" type="text" name="name" id="register-name" value={data.name} onChange={handleFieldChange} placeholder="Peter" required/>
          </label>
          <label className="form__item" htmlFor="register-email">
            <span>Твой e-mail*: </span>
            <input className="form__input" type="email" name="email" id="register-email" value={data.email} onChange={handleFieldChange} placeholder="peter@yahoo.com" autoComplete="username" required/>
          </label>
          <label className="form__item" htmlFor="register-avatar">
            <span>Загрузи аватар: </span>
            <Upload onFileUpload={handleFileUpload} inputId="register-avatar" name="avatar"/>
          </label>
          <label className="form__item" htmlFor="register-password">
            <span>Выбери пароль*: </span>
            <input className="form__input" type="password" name="password" id="register-password" value={data.password} onChange={handleFieldChange} placeholder="Password" autoComplete="new-password" required/>
          </label>
          <label className="form__item" htmlFor="register-confirm-password">
            <span>Подтверди пароль*: </span>
            <input className="form__input" type="password" name="confirmPassword" id="register-confirm-password" value={data.confirmPassword} onChange={handleFieldChange} placeholder="Confirm password" autoComplete="new-password" required/>
          </label>
        </fieldset>
      }
      {
        registrationStep === RegistrationSteps.HealthGoals &&
        <fieldset className="form__fieldset">
          <label className="form__item" htmlFor="register-gender">
            <span>Пол*: </span>
            <select className="form__input form__input--select" name="gender" aria-label="choose registration gender:" required>
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
            <select className="form__input form__input--select" name="activity" aria-label="choose activity level:" required>
              {
                Object.values(ActivityLevelTranslations).map((l) => (
                  <option key={`activity-${l}`} value={l}>{l}</option>
                ))
              }
            </select>
          </label>
          <label className="form__item" htmlFor="register-target">
            <span>Цель программы*: </span>
            <select className="form__input form__input--select" name="target" aria-label="choose nutrition target:" required>
              {
                Object.values(NutritionTarget).map((t) => (
                  <option key={`target-${t}`} value={t}>{t}</option>
                ))
              }
            </select>
          </label>
        </fieldset>
      }
      <button className="button" type="button" onClick={handleRegister}>
        {
          registrationStep === RegistrationSteps.AccountSetup
          ?
          'Вперед'
          :
            isAuthing
            ?
            <LoadingSpinner size={"20"}/>
              :
              'Регистрация!'}
      </button>
      {
        registrationStep === RegistrationSteps.HealthGoals
        &&
        <button className="button" type="button" onClick={() => dispatch(setRegistrationStep({ step: RegistrationSteps.AccountSetup }))}>Назад</button>
      }
    </form>
  )
}
