import { collection, where, getDocs, updateDoc, query } from 'firebase/firestore';
import { auth, db } from './../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { changeIsPending, changeUserDetails, login } from '../store/fbSlice';

const useFirebase = () => {
  const dispatch = useDispatch()
  // const tmpDate = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)

  const loginTest = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).then(
    )
  }

  const isFirstLogin = (email) => {
    const tmpDate = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)
    const userCollection = collection(db, "users")
    const userQuery = query(userCollection, where("email", "==", email))
    getDocs(userQuery).then(
      (res) => {
        if (res.docs[0].data().lastAccess !== tmpDate) {
          updateDoc(res.docs[0].ref, {
            lastAccess: tmpDate,
            todayPosting: 0,
          })
        }
      }
    )
  }

  const resetDate = (email) => {
    const tmpDate = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)
    const userCollection = collection(db, "users")
    const userQuery = query(userCollection, where("email", "==", email))
    getDocs(userQuery).then(
      (res) => {
        if (res.docs[0].data().lastAccess !== tmpDate) {
          updateDoc(res.docs[0].ref, {
            lastAccess: tmpDate,
            todayPosting: 0,
          })
        }
      }
    )
  }

  const getUser = (email) => {
    const userCollection = collection(db, "users")
    const userQuery = query(userCollection, where("email", "==", email))
    let result = []
    getDocs(userQuery)
      .then((res) => {
        res.forEach((r) => {
          result.push(r.data())
        })
        // result.push(res.docs[0].data())
        // console.log(res.docs[0].data())
        console.log(res.docs[0].data())
        dispatch(login());
        dispatch(changeUserDetails(res.docs[0].data()))
      })
  }

  const loginButtonTest = (email, password) => {
    // let userCollection = collection(db, "users")
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("TEST:", userCredential)
        console.log("TEST uc:", userCredential.user.reloadUserInfo)
        const user = userCredential.user
        const userDate = user.metadata.lastLoginAt

        console.log("LL", (userDate))
        isFirstLogin(email)

        const userCollection = collection(db, "users")
        const userQuery = query(userCollection, where("email", "==", email))
        let result = []
        getDocs(userQuery)
          .then((res) => {
            res.forEach((r) => {
              result.push(r.data())
            })
            // result.push(res.docs[0].data())
            // console.log(res.docs[0].data())
            console.log(res.docs[0].data())
            dispatch(login());
            dispatch(changeUserDetails(res.docs[0].data()))
          })
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("errCode: ", errorCode)
        console.log("errorMessage: ", errorMessage)
      })
  }
  return { loginButtonTest }
}

export default useFirebase