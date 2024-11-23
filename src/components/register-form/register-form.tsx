import { ChangeEvent, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/root-reducer"
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { ErrorMessages } from "../../const";
import { setStatusMessage, setUserInformation, setUploadedPath, setActiveUser } from "../../store/action";
import { addNewUserToDatabase, loginAction } from "../../store/api-actions";
import { setUser } from "../../store/slices/user-slice";
import { Upload } from "../upload-picture/upload-picture";

export function RegisterForm(): JSX.Element {
  const usersAmount = useSelector((state: RootState) => state.data.users.length);

  const dispatch = useDispatch();

  const authedUser = useSelector((state: RootState) => state.data.activeUser);

  const [isAuthing, setIsAuthing] = useState(false);

  const defaultData = {
    id: usersAmount,
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    liked: [],
    avatar: "",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthing(true);
    const auth = getAuth();

    if (data.password !== data.confirmPassword) {
      dispatch(setStatusMessage({message: ErrorMessages.RegisterPasswordNotMatch}))
      setIsAuthing(false);
      return;
    }

    const passwordValidationRegex = /^(?=.*\d).{8,}$/;
    if (!passwordValidationRegex.test(data.password)) {
      dispatch(setStatusMessage({message: ErrorMessages.PasswordError}))
      setIsAuthing(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      await addNewUserToDatabase({
        id: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        isAdmin: false,
        liked: [],
        avatar: data.avatar,
        token,
      }, dispatch);

      dispatch(setUser({
        email: user.email!,
        id: user.uid,
        token
      }));

      authedUser && dispatch(setUserInformation({ userInformation: authedUser }));

      const authData = {
        login: data.email,
        password: data.password,
      };

      const userInfo = {
        email: user.email!,
        id: user.uid,
        token: token
      };
      localStorage.setItem('nutrition-user', JSON.stringify(userInfo));

      dispatch(setUploadedPath({ path: null }));
      dispatch(setActiveUser({activeUser: userInfo}));
      loginAction(authData);
      setData(defaultData);

    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user: ' + error);
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
    <form action="" method="post" onSubmit={handleRegister}>
      <h1 className="title title--2">Registration</h1>
      <p>* - required fields</p>
      <fieldset>
        <label htmlFor="register-name">
          <span>Your name or nickname*: </span>
          <input type="text" name="name" id="register-name" value={data.name} onChange={handleFieldChange} placeholder="Peter" required/>
        </label>
        <label htmlFor="register-email">
          <span>Your email*: </span>
          <input type="email" name="email" id="register-email" value={data.email} onChange={handleFieldChange} placeholder="peter@yahoo.com" autoComplete="username" required/>
        </label>
        <label htmlFor="register-name">
          <span>Your phone: </span>
          <input type="phone" name="phone" id="register-phone" value={data.phone} onChange={handleFieldChange} placeholder="0541234567"/>
        </label>
        <label htmlFor="register-avatar">
          <span>Choose avatar: </span>
          <Upload onFileUpload={handleFileUpload} inputId="register-avatar" name="avatar"/>
        </label>
        <label htmlFor="register-password">
          <span>Enter password*: </span>
          <input type="password" name="password" id="register-password" value={data.password} onChange={handleFieldChange} placeholder="password" autoComplete="new-password" required/>
        </label>
        <label htmlFor="register-confirm-password">
          <span>Confirm password*: </span>
          <input type="password" name="confirmPassword" id="register-confirm-password" value={data.confirmPassword} onChange={handleFieldChange} placeholder="confirm password" autoComplete="new-password" required/>
        </label>
      </fieldset>
      <button className="button" type="submit">Register!</button>
    </form>
  )
}
