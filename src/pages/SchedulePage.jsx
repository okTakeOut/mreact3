import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { useCallback, useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where, updateDoc, deleteField, deleteDoc, doc } from 'firebase/firestore';
import { db } from './../firebase';
import Pagination from '../components/Pagination';

const SchedulePage = () => {
  const navigate = useNavigate()
  const sortFilters = [
    { "createdAt": "생성날짜" },
    { "modifiedAt": "수정날짜" },
    { "scheduleName": "스케쥴명" },
    { "hostName": "호스트명" },
    { "startDate": "시작일" },
    { "endDate": "종료일" },
  ]

  const selectList = {
    buildingNumber: [1, 2, 3],
    roomNumber: [101, 102, 103, 201, 202, 203, 301, 302, 303]
  }

  const limit = 10;

  const [update, setUpdate] = useState(true)

  const onChangeValue = (event) => {
    if (event.target.id === "sortingFilter") {
      setSortFilter(event.target.value);
    }
  }



  const [schedules, setSchedules] = useState({})
  const [numberOfSchedules, setNumberOfSchedules] = useState(0)
  const [sortFilter, setSortFilter] = useState("modifiedAt");

  const [currentSchedule, setCurrentSchedule] = useState(null);

  const refs = {
    scheduleNameRef: useRef(),
    hostNameRef: useRef(),
    startDateRef: useRef(),
    endDateRef: useRef(),
    buildingNumberRef: useRef(),
    roomNumberRef: useRef(),
    memoRef: useRef(),
    pwRef: useRef(),
  }

  const clearRefs = () => {
    Object.values(refs).forEach((val) => {
      val.current.value = "";
    })
  }

  const clearPwRef = () => {
    refs.pwRef.current.value = "";
  }

  const validPassword = () => {
    if (refs.pwRef.current.value === "admin") {
      setIsEditMode(!isEditMode)
    }
  }

  const editValidatationFunction = () => {
    return (
      !refs.scheduleNameRef.current.value ||
      !refs.buildingNumberRef.current.value ||
      !refs.roomNumberRef.current.value ||
      (refs.startDateRef.current.value > refs.endDateRef.current.value)
    )
  }

  const initRefs = () => {
    if (currentSchedule) {
      refs.scheduleNameRef.current.value = currentSchedule.scheduleName
      refs.hostNameRef.current.value = currentSchedule.hostName
      refs.startDateRef.current.value = currentSchedule.startDate
      refs.endDateRef.current.value = currentSchedule.endDate
      refs.buildingNumberRef.current.value = currentSchedule.buildingNumber
      refs.roomNumberRef.current.value = currentSchedule.roomNumber
      refs.memoRef.current.value = currentSchedule.memo
    }
  }

  const onClickSchedule = (event) => {
    setIsEditMode(false)
    setEditPassword(false)
    let tmpUid = event.target.id
    if (currentSchedule && tmpUid === currentSchedule.uid) {
      setCurrentSchedule(null)
      return
    }
    let tmpCurrentSchedule = schedules.filter((schedule) => schedule.uid === tmpUid)
    setCurrentSchedule(tmpCurrentSchedule[0])
  }

  useEffect(() => {
    initRefs()
  }, [currentSchedule])

  const isChangedFunction = () => {
    if (isEditMode) {
      return (
        refs.scheduleNameRef.current.value !== currentSchedule.scheduleName ||
        refs.hostNameRef.current.value !== currentSchedule.hostName ||
        refs.startDateRef.current.value !== currentSchedule.startDate ||
        refs.endDateRef.current.value !== currentSchedule.endDate ||
        refs.buildingNumberRef.current.value !== String(currentSchedule.buildingNumber) ||
        refs.roomNumberRef.current.value !== String(currentSchedule.roomNumber) ||
        refs.memoRef.current.value !== currentSchedule.memo
      )
    }
    else {
      return false
    }
  }

  const onClickEditButton = useCallback(() => {
    console.log("onClickEditButton")
    console.log(
      refs.scheduleNameRef.current.value,
      refs.hostNameRef.current.value,
      refs.startDateRef.current.value,
      refs.endDateRef.current.value,
      refs.buildingNumberRef.current.value,
      refs.roomNumberRef.current.value,
      refs.memoRef.current.value
    )
    const scheduleCollection = collection(db, "schedules")
    const dt = query(scheduleCollection, where("uid", "==", currentSchedule.uid))
    getDocs(dt).then((res) => {
      updateDoc(res.docs[0].ref, {
        hostName: refs.scheduleNameRef.current.value,
        startDate: refs.startDateRef.current.value,
        endDate: refs.endDateRef.current.value,
        buildingNumber: refs.buildingNumberRef.current.value,
        roomNumber: refs.roomNumberRef.current.value,
        memo: refs.memoRef.current.value,
        modifiedAt: new Date(),
      })
    }).then(
      console.log("Successfully Edited")
    ).then(
      setUpdate(!update)
    )
  })

  const onClickDeleteButton = () => {
    const scheduleCollection = collection(db, "schedules")
    const dt = query(scheduleCollection, where("uid", "==", currentSchedule.uid))
    // let keys;
    const deleteDocumentFunction = async () => {
      await getDocs(dt).then(
        (res) => {
          let keys = Object.keys(res.docs[0].data())
          keys.forEach((key) => {
            updateDoc(res.docs[0].ref, {
              [key]: deleteField(),
            })
          })
        }).then(
          () => {
            deleteDoc(doc(scheduleCollection, currentSchedule.uid))
          }
        )
    }
    deleteDocumentFunction()
    setCurrentSchedule(null)
    getSchedules()
  }


  const [isChanged, setIsChanged] = useState(false)


  const getSchedules = async () => {
    const scheduleCollection = collection(db, "schedules")
    let result = [];
    getDocs(scheduleCollection).then(
      (res) => {
        res.forEach((r) => {
          result = [...result, r.data()]
        })
        console.log(result)
        console.log(result.length)
        setNumberOfSchedules(result.length)

        if (sortFilter === "createdAt" || sortFilter === "modifiedAt") {
          result.sort((a, b) => a[sortFilter].toString().localeCompare(b[sortFilter].toString())).reverse()
        }
        else {
          result.sort((a, b) => a[sortFilter].localeCompare(b[sortFilter]))
        }
        result.forEach((res, idx) => { res.numbering = idx + 1 })
        setSchedules(result);
      }
    )
  }

  const [isEditMode, setIsEditMode] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const changeCurrentPageNumber = (pageNumber) => {
    if (pageNumber > Math.ceil(schedules.length / limit)) {
      pageNumber = Math.ceil(schedules.length / limit)
    }
    if (pageNumber < 1) {
      pageNumber = 1
    }
    setCurrentPageNumber(pageNumber)
  }

  useEffect(() => {
    getSchedules()
  }, [sortFilter])

  useEffect(() => {
    getSchedules()
    console.log("[Effect]:", update)
  }, [update])

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "end",
          marginBottom: "0.5rem"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end"
          }}>
          Sort by: <select
            style={{
              marginLeft: "0.5rem",
              cursor: "pointer"
            }}
            id="sortingFilter"
            onClick={(event) => console.log(event.target.value)}
            onChange={(event) => onChangeValue(event)}
          >
            {sortFilters.map((sf) => {
              return (
                <option value={Object.keys(sf)}>{Object.values(sf)}</option>
              )
            })}
          </select>
        </div>
      </div>

      <div
        style={currentSchedule ? { display: "flex", flexDirection: "row" } : null}
      >
        <div style={currentSchedule ? { flexGrow: "1" } : null}>
          {numberOfSchedules > 0
            ? schedules && schedules.filter(
              (s) =>
                s.numbering >= limit * (currentPageNumber - 1) + 1
                && s.numbering <= limit * currentPageNumber
            ).map((schedule) => {
              return (
                <div className=""
                >
                  <ol
                    className="list-group" style={{ cursor: "pointer" }}>
                    <div className="form-control"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        border: `${currentSchedule && currentSchedule.uid === schedule.uid ? "1px solid teal" : ""}`,
                        borderRight: `${currentSchedule && currentSchedule.uid === schedule.uid ? "none" : ""}`,
                      }}
                      key={`scheudule-${schedule.uid}`}
                      id={schedule.uid}
                      onClick={(event) => onClickSchedule(event)}
                    >
                      <div style={{ pointerEvents: "none", fontWeight: "bold" }}>
                        #{schedule.numbering}
                      </div>
                      <div style={{ pointerEvents: "none" }}>
                        {schedule.scheduleName}
                      </div>
                    </div>
                  </ol>
                </div>
              )
            })
            :
            <div>Schedules Not Found.</div>
          }
          {
            currentPageNumber === parseInt(numberOfSchedules / limit + 1)
              ? Array(parseInt(limit - numberOfSchedules % limit)).fill(1).map((val, idx) => {
                return (
                  <ol
                    className="list-group" style={{ cursor: "pointer" }}>
                    <div
                      className="form-control"
                      style={{ fontWeight: "bold", color: "thistle", fontSize: "2rem" }}
                    >
                      Empty Slot
                    </div>
                  </ol>
                )
              })
              : null
          }
        </div>

        {
          currentSchedule ?
            <div
              className="form-control"
              style={
                currentSchedule
                  ? { width: "24rem", border: "1px solid teal", display: "flex", flexDirection: "column" }
                  : {}
              }
            >
              <div style={{ display: "flex", flexDirection: "column" }}>

                <div
                  style={{
                    display: "flex", flexDirection: "row"
                  }}
                >
                  <div
                    className="form-control"
                    style={{
                      border: "none",
                      textAlign: "start",
                      // color: "steelblue",
                      color: "tomato",
                      fontWeight: "bold",
                      fontStyle: "italic",
                      visibility: `${!isEditMode ? "hidden" : ""}`
                    }}
                  >Now Editing...</div>
                  <div
                    className="btn btn-close my-auto"
                    onClick={() => {
                      initRefs()
                      setIsEditMode(false)
                      setCurrentSchedule(null)
                    }}
                  >
                  </div>
                </div>
                <div
                  className="form-control"
                  type="text"
                  style={{ border: "none", fontWeight: "bold" }}
                >Schedule Name</div>
                <input
                  className="form-control disabled"
                  type="text"
                  ref={refs.scheduleNameRef}
                  defaultValue={currentSchedule?.scheduleName}
                  onChange={() => setIsChanged(isChangedFunction())}
                  disabled={!isEditMode}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="form-control"
                  type="text"
                  style={{ border: "none", fontWeight: "bold" }}
                >Host Name</div>
                <input
                  className="form-control disabled"
                  type="text"
                  // ref={hostNameRef}
                  ref={refs.hostNameRef}
                  defaultValue={currentSchedule?.hostName}
                  disabled
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="form-control"
                  type="date"
                  style={{ border: "none", fontWeight: "bold" }}
                >Date (Start / End)</div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <input
                    className="form-control disabled"
                    type="date"
                    style={{ margin: "0 0.5rem 0 0" }}
                    // ref={startDateRef}
                    ref={refs.startDateRef}
                    defaultValue={currentSchedule?.startDate}
                    onChange={() => setIsChanged(isChangedFunction())}
                    disabled={!isEditMode}
                  />
                  <input
                    className="form-control disabled"
                    type="date"
                    style={{ margin: "0 0 0 0.5rem" }}
                    // ref={endDateRef}
                    ref={refs.endDateRef}
                    defaultValue={currentSchedule?.endDate}
                    onChange={() => setIsChanged(isChangedFunction())}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="form-control"
                  type="text"
                  style={{ border: "none", fontWeight: "bold" }}
                >Location (Building / Room)</div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <select
                    className="form-control disabled"
                    type="text"
                    style={{ margin: "0 0.5rem 0 0" }}
                    // ref={buildingNumberRef}
                    ref={refs.buildingNumberRef}
                    defaultValue={currentSchedule?.buildingNumber}
                    onChange={() => setIsChanged(isChangedFunction())}
                    disabled={!isEditMode}
                  >
                    {selectList.buildingNumber.map(
                      (bn) => {
                        return (
                          <option
                            value={bn}
                          >
                            {bn}관
                          </option>
                        )
                      }
                    )}
                  </select>
                  <select
                    className="form-control disabled"
                    type="text"
                    style={{ margin: "0 0 0 0.5rem" }}
                    // ref={roomNubmerRef}
                    ref={refs.roomNumberRef}
                    defaultValue={currentSchedule?.roomNumber}
                    onChange={() => setIsChanged(isChangedFunction())}
                    disabled={!isEditMode}
                  >
                    {selectList.roomNumber.map(
                      (rn) => {
                        return (
                          <option
                            value={rn}
                          >
                            {rn}호
                          </option>
                        )
                      }
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  className="form-control"
                  type="text"
                  style={{ border: "none", fontWeight: "bold" }}
                >Memo</div>
                <textarea
                  className="form-control disabled"
                  // ref={memoRef}
                  ref={refs.memoRef}
                  defaultValue={currentSchedule?.memo}
                  onChange={() => setIsChanged(isChangedFunction())}
                  rows={5}
                  disabled={!isEditMode}
                />
              </div>

              <hr />
              {
                !isEditMode ?
                  !editPassword
                    ?
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row"
                      }}>
                      <div
                        className="form-control"
                        style={{
                          backgroundColor: "#008080",
                          color: "white",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => { setEditPassword(true) }}
                      >
                        Edit
                      </div>
                      <div
                        className="form-control"
                        style={{
                          backgroundColor: "#000000",
                          color: "white",
                          textAlign: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => { navigate(`/details/${currentSchedule.uid}`) }}
                      >
                        Detail
                      </div>
                    </div>
                    :
                    <div className=""
                      style={{
                        display: "flex",
                        flexDirection: "row"
                      }}
                    >
                      <input
                        className="form-control"
                        type="password"
                        ref={refs.pwRef}
                        style={{
                          marginRight: "0.2rem",
                          borderColor: "#b7b9bc"
                        }}
                      />
                      <div className="btn btn-sm"
                        style={{
                          width: "5rem",
                          backgroundColor: "#008080",
                          color: "#ffffff",
                          borderRadius: "10%",
                          paddingTop: "0.4rem",
                          paddingBottom: "0.4rem",
                          marginRight: "0.2rem",
                        }}
                        onClick={() => {
                          validPassword()
                        }}
                      >Enter</div>
                      <div className="btn btn-sm"
                        style={{
                          width: "5rem",
                          backgroundColor: "#990030",
                          color: "#ffffff",
                          borderRadius: "10%",
                          paddingTop: "0.4rem",
                          paddingBottom: "0.4rem"
                        }}
                        onClick={() => { setEditPassword(!editPassword) }}
                      >Cancel</div>
                    </div>

                  : <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "end"
                    }}>
                    <div
                      className={`${isChanged ? "" : "disabled"} btn btn-sm`}
                      style={{
                        width: "4rem",
                        backgroundColor: "#008080",
                        color: "#ffffff",
                        borderRadius: "10%",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                        marginRight: "0.2rem",
                      }}
                      onClick={onClickEditButton}
                    >Edit</div>
                    <div
                      className="btn btn-sm"
                      style={{
                        width: "4rem",
                        backgroundColor: "#cc0041",
                        color: "#ffffff",
                        borderRadius: "10%",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                        marginRight: "0.2rem",
                      }}
                      onClick={onClickDeleteButton}
                    >Delete</div>
                    <div
                      className="btn btn-sm"
                      style={{
                        width: "4rem",
                        backgroundColor: "#b7b9bc",
                        color: "#000000",
                        borderRadius: "10%",
                        paddingTop: "0.4rem",
                        paddingBottom: "0.4rem",
                      }}
                      onClick={() => {
                        initRefs()
                        setIsEditMode(false)
                        setEditPassword(false)
                      }}
                    >Cancel</div>
                  </div>
              }
            </div>
            : <></>
        }
      </div>

      {schedules.length
        ?
        <Pagination
          currentPageNumber={currentPageNumber}
          numberOfPages={schedules.length}
          changeCurrentPageNumber={changeCurrentPageNumber}
          limit={limit}
        />
        : null}
      <div>
        {
          <div
            className={`btn btn-primary`}
            style={{ marginTop: "1rem" }}
            onClick={() => navigate('/posting')}
          >New Schedule</div>
        }
      </div>
      <hr />
    </div>
  )
}

export default SchedulePage