import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentSchedule, addSchedule, changeUserQuery, login } from '../store/fbToolSlice';
import { collection, getDocs, query, where, updateDoc, deleteField, deleteDoc, doc, setDoc, orderBy, limit, startAt, endAt } from 'firebase/firestore';
import { db } from './../firebase';
import { useCallback } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const useFbTool = () => {
  const dispatch = useDispatch()
  const scheduleCollection = collection(db, "schedules")
  const sortFilter = useSelector((state) => state.fbTool.scheduleState.sortFilter)

  const userCollection = collection(db, "users")
  const auth = getAuth();

  const isFirstLogin = useCallback((email) => {
    const userQuery = query(userCollection, where("email", "==", email))
    let newQuery = userQuery
    let tmp = String(new Date().getFullYear()) + String("0" + (new Date().getMonth() + 1)).slice(-2) + String("0" + (new Date().getDate())).slice(-2)

    getDocs(userQuery).then((res) => {
      if (res.docs[0].data.lastAccess !== tmp) {
        updateDoc(res.docs[0].ref, {
          lastAccess: tmp,
          todayPosting: 0,
        })
        console.log("[isFirstLogin] update login date")
      }
      newQuery = query(userCollection, where("email", "==", email))
    }).then(
      getDocs(newQuery).then((rres) => {
        let rresult = [];
        rres.forEach((rr) => {
          rresult.push(rr.data())
        })
        dispatch(changeUserQuery(rresult[0]))
        console.log("[isFirstLogin] Dispatch")
        dispatch(login())
      })
    )
  })


  const loginButton = (email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user
      console.log("User Logged:", user)

      const userQuery = query(userCollection, where("email", "==", user.email))

      getDocs(userQuery).then((res) => {
        let result = [];
        res.forEach((r) => {
          result.push(r?.data())
        })
        dispatch(changeUserQuery(result[0]))
      })
      console.log("UserQuery Changed!")
      dispatch(login());
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errCode: ", errorCode)
      console.log("errorMessage: ", errorMessage)
    })
  }


  const loginButton2 = useCallback((email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user
      console.log("[LoginBUtton2] User: ", user)
      // console.log()
      // isFirstLogin(email.slice(0,-10))
      isFirstLogin(email)
      // const userQuery = query(userCollection, where("email", "==", user.email))

      // getDocs(userQuery).then((res) => {
      //   let result = [];
      //   res.forEach((r) => {
      //     result.push(r?.data())
      //   })

      //   dispatch(changeUserQuery(result[0]))
      //   console.log("[LoginButton2][result]", result[0])
      // })
      // // dispatch(changeUserQuery(userQuery))
      // console.log("[LoginButton2] UserQuery Changed!")
      // dispatch(login());
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("errCode: ", errorCode)
      console.log("errorMessage: ", errorMessage)
    })
  })


  const getSchedules = useCallback((currentPage, numberOfPages) => {
    let result = [];
    console.log(scheduleCollection)
    getDocs(scheduleCollection).then(
      (res) => {
        console.log("res: ", res.docs[0])
        res.forEach((r) => {
          result = [...result, r.data()]
        })
        if (sortFilter) {
          sortFilter === "createdAt" || sortFilter === "modifiedAt"
            ? result.sort((a, b) => a[sortFilter].toString().localeCompare(b[sortFilter].toString())).reverse()
            : result.sort((a, b) => a[sortFilter].localeCompare(b[sortFilter]))
        }
        result.forEach((res, idx) => { res.numbering = idx + 1; })
        console.log("getSchedule res: ", result)
        dispatch(addSchedule(result))
      }
    )
  })

  const editSchedule = useCallback((id, scheduleObject) => {
    const dt = query(scheduleCollection, where("scheduleId", "==", id))

    getDocs(dt).then((res) => {
      updateDoc(res.docs[0].ref, {
        hostName: scheduleObject.hostName,
        scheduleName: scheduleObject.scheduleName,
        startDate: scheduleObject.startDate,
        endDate: scheduleObject.endDate,
        buildingNumber: scheduleObject.buildingNumber,
        roomNumber: scheduleObject.roomNumber,
        memo: scheduleObject.memo,
        modifiedAt: new Date(),
      })
    })
  })

  const submitNewSchedule = useCallback((scheduleObject) => {
    setDoc(doc(scheduleCollection, scheduleObject.inputScheduleName), {
      scheduleId: `${new Date().getTime()}${scheduleObject.inputHostName}`,
      scheduleName: scheduleObject.inputScheduleName,
      hostName: scheduleObject.inputHostName,
      startDate: scheduleObject.inputStartDate,
      endDate: scheduleObject.inputEndDate,
      buildingNumber: scheduleObject.inputBuildingNumber,
      roomNumber: scheduleObject.inputRoomNumber,
      memo: scheduleObject.inputMemo,
      createdAt: new Date(),
      modifiedAt: new Date(),
    })
  })

  const deleteSchedule = async (id) => {
    const dt = query(scheduleCollection, where("scheduleId", "==", id))
    const querySnapshot = await getDocs(dt)
    let keys;
    keys = Object.keys(querySnapshot.docs[0].data())
    keys.forEach((key) => {
      updateDoc(querySnapshot.docs[0].ref, {
        [key]: deleteField(),
      })
    })
    await deleteDoc(querySnapshot.docs[0].ref);
  }


  const getScheduleFromId = useCallback((id) => {
    console.log("getSchedule with", sortFilter)
    let result = [];

    getDocs(scheduleCollection).then(
      (res) => {
        res.forEach((r) => {
          result = [...result, r.data()]
        })
        if (sortFilter) {
          sortFilter === "createdAt" || sortFilter === "modifiedAt"
            ? result.sort((a, b) => a[sortFilter].toString().localeCompare(b[sortFilter].toString()))
            : result.sort((a, b) => a[sortFilter].localeCompare(b[sortFilter]))
        }
        result.forEach((res, idx) => { res.numbering = idx + 1; })
        let [rresult,] = result.filter((r) => r.scheduleId === id)
        console.log("getSchedule res: ", rresult)
        dispatch(changeCurrentSchedule(rresult))
      }
    )
  })

  return { getSchedules, deleteSchedule, getScheduleFromId, submitNewSchedule, editSchedule, loginButton, loginButton2 }
}

export default useFbTool;