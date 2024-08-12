import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useState, useEffect } from 'react';
import useFbTool from './../hooks/useFbTool';
import { useDispatch } from 'react-redux';
import useFirebase from "../hooks/useFirebase";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [inputId, setInputId] = useState("");
  const [inputPassword, setInputPassword] = useState("")
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

  const { loginButton, loginButton2 } = useFbTool();
  const { loginButtonTest } = useFirebase();

  const onSubmitButton = async (event) => {
    event.preventDefault()
    console.log("ID: ", inputId)
    console.log("PW: ", inputPassword)
    console.log(getAuth().currentUser)
    // await loginButton(inputId, inputPassword)
    // await loginButton2(inputId, inputPassword)
    await loginButtonTest(inputId, inputPassword)
    console.log("onSubmit")
    console.log(getAuth().currentUser)
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

export default SignUpForm