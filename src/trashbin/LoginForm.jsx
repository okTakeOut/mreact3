import { signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from "../firebase";
import { collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { changeUserDetails } from "../store/fbSlice";

const LoginForm = () => {
  const dispatch = useDispatch();
  const tag = "[LoginForm]"
  const TODAY = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)
  const [inputId, setInputId] = useState("");
  const [inputPassword, setInputPassword] = useState("")

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setInputId("")
    setInputPassword("")
  }

  const onChangeValue = (event) => {
    if (event.target.id === "formId") {
      setInputId(event.target.value)
      return;
    }
    if (event.target.id === "formPw") {
      setInputPassword(event.target.value)
      return;
    }
  }


  const onSubmitButton = async (event) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, inputId, inputPassword).then(
        async (userCredential) => {
          const userCollection = collection(db, "users")
          const userQuery = query(userCollection, where("uid", "==", userCredential.user.uid))

          // let tmpData = {}
          const querySnapshot = await getDocs(userQuery).then(
            async (res) => {
              let tmp = res.docs[0].data().lastAccess;
              console.log("LA: ", tmp)
              console.log("TODAY:", TODAY)
              if (tmp !== TODAY) {
                await updateDoc(res.docs[0].ref, {
                  lastAccess: TODAY,
                  todayPosting: 0,
                })
              }
              console.log("[DOCUMNET UPDATE]")
            }
          )
        }
      )
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage("")
      }, 5000);
    }
    finally {
      setLoading(false)
    }
  }


  return (
    <>
      <div>LoginForm</div>

      <div className="form-control">
        <div className="d-flex">
          <input
            className="form-control"
            id="formId"
            type="email"
            style={{ width: "16rem" }}
            placeholder={"Example@mail.com"}
            required
            onChange={(event) => onChangeValue(event)}
          >
          </input>
          <input
            className="form-control"
            id="formPw"
            style={{ width: "16rem" }}
            placeholder={"password"}
            required
            onChange={(event) => onChangeValue(event)}
          >
          </input>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={(event) => onSubmitButton(event)}>Login</button>
        </div>
      </div>
    </>
  )
}

export default LoginForm