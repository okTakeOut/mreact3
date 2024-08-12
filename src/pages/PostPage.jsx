import { useEffect, useState } from 'react';
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useSelector } from 'react-redux';
import { collection, setDoc, doc } from 'firebase/firestore';
import { db } from './../firebase';

const PostPage = () => {
  const navigate = useNavigate()
  const userDetails = useSelector((state) => state.fb.authState.userDetails)

  const [errorMessage, setErrorMessage] = useState("")

  const scheduleCollection = collection(db, "schedules")
  const selectList = {
    buildingNumber: [1, 2, 3],
    roomNumber: [101, 102, 103, 201, 202, 203, 301, 302, 303]
  }
  // const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    fHostName: userDetails.displayName,
    fScheduleName: "",
    fStartDate: today,
    fEndDate: today,
    fBuildingNumber: 1,
    fRoomNumber: 101,
    fMemo: "",
  })

  const resetFormData = () => {
    setFormData({
      fHostName: userDetails.displayName,
      fScheduleName: "",
      fStartDate: today,
      fEndDate: today,
      fBuildingNumber: 1,
      fRoomNumber: 101,
      fMemo: "",
    });
  }

  const onChangeValue = (event) => {
    setFormData((prev) => {
      return (
        {
          ...prev,
          [event.target.id]: event.target.value
        }
      )
    })
  }

  const validationCheck = () => {
    return (
      !formData.fScheduleName ||
      !formData.fBuildingNumber ||
      !formData.fRoomNumber ||
      (formData.fStartDate > formData.fEndDate)
    )
  }

  const onSubmitButton = async () => {
    try {
      if (validationCheck()) {
        const ee = new Error("Form validation failed. Try again.")
        throw ee
      }
      console.log("SetDocs Start")
      const uid = uuid()
      await setDoc(doc(scheduleCollection, uid), {
        uid: uid,
        hostName: formData.fHostName,
        scheduleName: formData.fScheduleName,
        startDate: formData.fStartDate,
        endDate: formData.fEndDate,
        buildingNumber: formData.fBuildingNumber,
        roomNumber: formData.fRoomNumber,
        memo: formData.fMemo,
        createdAt: new Date(),
        modifiedAt: new Date(),
      })
      navigate('/schedules')

    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage("")
      }, 3000);
    }

  }

  // useEffect(() => {
  //   if (!auth.currentUser) {
  //     navigate('/')
  //   }
  // }, [])

  return (
    <div>
      <div className="form">
        <div className="container mt-3">
          <div className="d-flex">
            <div
              style={{ fontSize: "1.4rem", fontWeight: "bolder" }}
            >Posting Page</div>
          </div>
          <hr />
          <div
            className="container form-group border border-secondary rounded"
            style={{ width: "80%" }}>
            <div
              className="form-control"
              style={{
                border: "none",
                padding: "3rem"
              }}>
              <div className="d-flex"
                style={{
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}>
                <div style={{ color: "tomato", margin: "0.2rem" }}>*</div>
                <div>Schedule Name</div>
              </div>
              <input
                className="form-control"
                type="text"
                style={{ marginBottom: "1rem", }}
                id="fScheduleName"
                onChange={(event) => onChangeValue(event)}
              />
              <div className="d-flex"
                style={{
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}>
                <div style={{ color: "tomato", margin: "0.2rem" }}>*</div>
                <div>Host Name</div>
              </div>
              <input className="form-control" type="text" style={{ marginBottom: "1rem" }}
                disabled value={userDetails.displayName} />

              <div className="" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <div className="" style={{ width: "48.5%" }}>
                  <div className="d-flex "
                    style={{
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}>
                    <div style={{ color: "tomato", margin: "0.2rem" }}>*</div>
                    <div>Start Date</div>
                  </div>
                  <input
                    className="form-control"
                    type="date"
                    style={{ marginBottom: "1rem" }}
                    id="fStartDate"
                    defaultValue={today}
                    onChange={(event) => onChangeValue(event)}
                  />
                </div>
                <div style={{ padding: "0 1rem" }}></div>
                <div className="" style={{ width: "48.5%" }}>
                  <div className="d-flex"
                    style={{
                      fontWeight: "bold",
                      marginTop: "1rem",
                    }}>
                    <div style={{ color: "tomato", margin: "0.2rem" }}>*</div>
                    <div>End Date</div>
                  </div>
                  <input
                    className="form-control"
                    type="date"
                    style={{ marginBottom: "1rem" }}
                    id="fEndDate"
                    defaultValue={today}
                    onChange={(event) => onChangeValue(event)}
                  />
                </div>
              </div>
              <div className="d-flex"
                style={{
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}>
                <div style={{ color: "tomato", margin: "0.2rem" }}>*</div>
                <div>Location (building / room)</div>
              </div>
              <div className="d-flex flex-row" style={{}}>
                <select
                  className="form-select"
                  id="fBuildingNumber"
                  defaultValue={1}
                  onChange={(event) => onChangeValue(event)}
                >
                  {selectList.buildingNumber.map((bn) => {
                    return (
                      <option value={bn}>{bn}관</option>
                    )
                  })}
                </select>
                <div style={{ padding: "0 1rem" }}></div>
                <select
                  className="form-select"
                  id="fRoomNumber"
                  defaultValue={101}
                  onChange={(event) => onChangeValue(event)}
                >
                  {selectList.roomNumber.map((rn) => {
                    return (
                      <option value={rn}>{rn}호</option>
                    )
                  })}
                </select>
              </div>
              <div
                className="d-flex"
                style={{
                  fontWeight: "bold",
                  marginTop: "1rem",
                }}>
                <div style={{ color: "tomato", margin: "0.2rem" }}></div>
                <div>Memo</div>
              </div>
              <textarea
                className="form-control"
                id="fMemo"
                onChange={(event) => onChangeValue(event)}
                type="text"
                style={{ marginBottom: "1rem", }}
                rows={6}
              ></textarea>
              <div className="d-flex flex-column justify-content-center"
                style={{ alignContent: "center" }}
              >
                <div className="btn btn-lg btn-dark mt-3"
                  onClick={onSubmitButton}
                >
                  submit
                </div>
                {/* <div className="btn btn-lg btn-info mt-3"
                  onClick={() => {
                    console.log(formData)
                    console.log(validationCheck())
                  }}
                >
                  Print
                </div> */}

                <div className="text-danger text-center">{errorMessage}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default PostPage;