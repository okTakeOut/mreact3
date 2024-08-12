import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from "../firebase";
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './../firebase';
import { useNavigate } from 'react-router-dom';
import { logout } from "../store/fbSlice";

const SignUpForm = () => {
  const tag = "[SignUpForm]"
  const TODAY = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)
  const pageSettings = useSelector((state) => state.fb.pageState.settings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputId, setInputId] = useState("");
  const [inputPassword, setInputPassword] = useState("")
  const [inputUserName, setInputUserName] = useState("")

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setInputId("")
    setInputPassword("")
    setInputUserName("")
  }

  const onChangeValue = (event) => {
    if (event.target.id === "signUpFormId") {
      setInputId(event.target.value)
      return;
    }
    if (event.target.id === "signUpFormPw") {
      setInputPassword(event.target.value)
      return;
    }
    if (event.target.id === "signUpFormUserName") {
      setInputUserName(event.target.value)
      return;
    }
  }

  const onSubmitButton = async (event) => {
    setLoading(true)
    try {
      const createdUser = await createUserWithEmailAndPassword(auth, inputId, inputPassword).then(
        (userCredential) => {
          const userCollection = collection(db, "users")
          setDoc(doc(userCollection, userCredential.user.uid), {
            email: inputId,
            uid: userCredential.user.uid,
            displayName: inputUserName,
            lastAccess: TODAY,
            todayPosting: 0,
          })
        }
      )
      if (!pageSettings.loginEnable) {
        dispatch(logout())
      }
      // const updatedProfile = await updateProfile(auth.currentUser, {
      //   displayName: inputUserName,
      //   lastAccess: TODAY,
      // })
      // navigate('/')
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage("")
      }, 5000);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div>SignUpForm</div>

      <div className="form-control d-flex flex-column">
        <div className="">
          <input
            className="form-control"
            id="signUpFormId"
            type="email"
            style={{ width: "16rem" }}
            placeholder={"Example@mail.com"}
            required
            onChange={(event) => onChangeValue(event)}
          >
          </input>
          <input
            className="form-control"
            id="signUpFormPw"
            style={{ width: "16rem" }}
            placeholder={"password"}
            required
            onChange={(event) => onChangeValue(event)}
          >
          </input>
          <input
            className="form-control"
            id="signUpFormUserName"
            style={{ width: "16rem" }}
            placeholder={"UserName"}
            required
            onChange={(event) => onChangeValue(event)}
          >
          </input>
          <div className="d-flex">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={auth.currentUser}
              onClick={(event) => onSubmitButton(event)}>Sign Up</button>
            <div className="ms-2 d-flex flex-column justify-content-center">
              {auth.currentUser && <div className="text-danger">Logout First...</div>}
            </div>
          </div>
        </div>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {loading && <div>Loading...</div>}
      </div>
    </>
  )
}

export default SignUpForm