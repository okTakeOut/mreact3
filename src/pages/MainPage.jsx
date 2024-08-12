import { useNavigate } from "react-router-dom";
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../firebase';
import { useState } from 'react';
import { useEffect } from 'react';
import NoticeBoard from "../components/NoticeBoard";
import styles from "./MainPage.module.css";

const MainPage = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState(null);
  const [newSchedules, setNewSchedules] = useState(null);
  const [todos, setTodos] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false)
  const icons = {
    check: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" viewBox="0 0 16 16"
      className={styles.check}>
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
    </svg>,
  }

  const onClickChangeMode = (event) => {
    if (event.target.id === "adminMode") {
      if (isAdmin) { return }
      setIsAdmin(true)
    }
    else {
      if (!isAdmin) { return }
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    const scheduleCollection = collection(db, "schedules")
    const loadSchedules = async () => {
      let result = [];
      let scheduleResult = [];
      await getDocs(scheduleCollection).then(
        (res) => {
          res.forEach((r) => {
            result = [...result, r.data()]
          })
          result.sort((a, b) => a["createdAt"].toString().localeCompare(b["createdAt"].toString())).reverse()
          for (let i of result) {
            scheduleResult = [...scheduleResult, {
              dataName: i.scheduleName,
              dataUid: i.uid
            }]
          }
          setSchedules(scheduleResult);
        }
      )
    }
    const todosCollection = collection(db, "todos")
    const loadTodos = async () => {
      let result = [];
      let todosResult = [];
      await getDocs(todosCollection).then(
        (res) => {
          res.forEach((r) => {
            result = [...result, r.data()]
          })
          result.sort((a, b) => b["modifiedAt"] - a["modifiedAt"])
          // result.sort((a, b) => a["createdAt"].toString().localeCompare(b["createdAt"].toString())).reverse()
          for (let i of result) {
            // todosResult = [...todosResult, i.tdName]
            todosResult = [...todosResult, {
              dataName: i.tdName,
              dataUid: i.uid,
            }]
          }
          setTodos(todosResult);
        }
      )
    }
    loadSchedules()
    loadTodos()
  }, [])
  schedules && console.log("[Main] schedules: ", schedules)

  return (
    <div style={{
      marginTop: "1.4rem",
    }}>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "2rem"
        }}>
        <div style={{
          fontWeight: "bold",
          marginBottom: "1.4rem"
        }}>
          Hello {isAdmin ? "Admin" : "Guest"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}>
          <div
            className="card card-body"
            style={{
              cursor: "pointer"
            }}
            id={"guestMode"}
            onClick={(event) => { onClickChangeMode(event) }}>
            <div
              style={{
                pointerEvents: "none"
              }}>
              <div
                className="card-title"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: !isAdmin ? "#0d6efd" : "",
                  fontWeight: !isAdmin ? "bold" : "",
                }}>Guest
                <div style={{
                  visibility: !isAdmin ? "" : "hidden"
                }}>{icons.check}</div>
              </div>
              <div
                style={{
                  whiteSpace: "pre-line"
                }}
              >
                {`Card Body1
            Card Body2
            Card Body3`}
              </div></div>
          </div>
          <div
            className="card card-body"
            style={{
              cursor: "pointer"
            }}
            id={"adminMode"}
            onClick={(event) => { onClickChangeMode(event) }}
          >
            <div
              style={{
                pointerEvents: "none"
              }}>
              <div
                className="card-title"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderColor: isAdmin ? "#0d6efd" : "",
                  fontWeight: isAdmin ? "bold" : "",
                }}>Admin
                <div style={{
                  visibility: isAdmin ? "" : "hidden",
                }}>{icons.check}</div>
              </div>
              <div
                style={{
                  whiteSpace: "pre-line"
                }}>
                {`Card Body1
            Card Body2
            Card Body3`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "15rem"
        }}
      >
        <NoticeBoard
          boardData={
            {
              more: "/",
              title: "How To Use",
              listSize: 5,
              // data: schedules,
              listPage: false,
            }
          }
        />
      </div>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "row",
          height: "15rem"
        }}
      >
        <NoticeBoard
          boardData={
            {
              more: "/schedules/",
              title: "Recently Added",
              listSize: 5,
              data: schedules,
              listPage: false,
            }
          }
        />
        <NoticeBoard
          boardData={
            {
              more: "/todo/",
              title: "To Do List",
              listSize: 5,
              data: todos,
              listPage: true,
            }
          }
        />
      </div>
      <hr />
    </div >
  )
}

export default MainPage;