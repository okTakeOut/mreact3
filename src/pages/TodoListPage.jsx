import { useState, useEffect, useCallback, useRef } from 'react';
import TodoForm from '../components/TodoForm';
import Pagination from './../components/Pagination';
import { collection, getDocs, query, where, updateDoc, deleteField, deleteDoc, doc } from 'firebase/firestore';
import { db } from './../firebase';
import styles from "./TodoListPage.module.css";

const TodoListPage = () => {
  const dateTool = () => {
    const Today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString()
    const date = {
      yymmdd: Today.slice(0, 10),
      hhmm: Today.slice(11, 19),
      am: true,
    }
    if (Number(date.hhmm.slice(0, 2)) >= 12) {
      date.hhmm = String(Number(date.hhmm.slice(0, 2)) - 12).padStart(2, "0") + date.hhmm.slice(2, 8)
      date.am = false
    }
    // console.log(date.yymmdd, date.hhmm, date.am)
    return date
  }
  const [editMode, setEditMode] = useState(false);

  const [sortFilters, setSortFilters] = useState({
    all: true,
    solved: true,
    notSolved: true,
    recent: true,
  })

  const onChangeSortFilter = (event) => {
    console.log(event.target.id)
    if (event.target.id === "sortAll") {
      if (sortFilters.all) {
        setSortFilters((prev) => {
          return ({
            ...prev,
            all: false,
            solved: false,
            notSolved: false
          })
        })
        return
      }
      else {
        setSortFilters((prev) => {
          return ({
            ...prev,
            all: true,
            solved: true,
            notSolved: true,
          })
        })
      }
    }

    if (event.target.id === "sortSolved") {
      if (sortFilters.solved) {
        setSortFilters((prev) => {
          return ({
            ...prev,
            all: false,
            solved: false,
          })
        })
        return
      }
      else {
        if (sortFilters.notSolved) {
          setSortFilters((prev) => {
            return ({
              ...prev,
              all: true,
              solved: true
            })
          })
          return
        }
        else {
          setSortFilters((prev) => {
            return ({
              ...prev,
              solved: true
            })
          })
        }
      }
    }

    if (event.target.id === "sortNotSolved") {
      if (sortFilters.notSolved) {
        setSortFilters((prev) => {
          return ({
            ...prev,
            all: false,
            notSolved: false,
          })
        })
        return
      }
      else {
        if (sortFilters.solved) {
          setSortFilters((prev) => {
            return ({
              ...prev,
              all: true,
              notSolved: true
            })
          })
          return
        }
        else {
          setSortFilters((prev) => {
            return ({
              ...prev,
              notSolved: true
            })
          })
        }
      }
    }

    if (event.target.id === "sortRecent") {
      console.log(event.target.id)
      setSortFilters((prev) => {
        return (
          {
            ...prev,
            recent: !sortFilters.recent
          }
        )
      })
      return
    }
  }

  const onChangeIsSolved = useCallback((uid) => {
    console.log(uid)
    const todosCollection = collection(db, "todos")
    const dt = query(todosCollection, where("uid", "==", uid))
    getDocs(dt).then((res) => {
      updateDoc(res.docs[0].ref, {
        isSolved: !res.docs[0].data().isSolved,
        yymmdd: dateTool().yymmdd,
        hhmm: dateTool().hhmm,
        am: dateTool().am,
        modifiedAt: new Date(),
      })
    })
    getTodos()
  },[])

  // const [tester, setTester] = useState(true)
  const icons = {
    check: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" viewBox="0 0 16 16"
      className={styles.check}>
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
    </svg>,
    counterClock: <svg xmlns="http://www.w3.org/2000/svg" widh="2rem" height="2rem" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"
      className={styles.counterClock}>
      <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
      <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
    </svg>,
    trash: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16"
      className={styles.trash}>
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>,
    doubleUpArrow: <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" class="bi bi-chevron-double-up" viewBox="0 0 16 16"
      style={{ alignSelf: "center", marginLeft: "0.2rem", pointerEvents: "none" }}>
      <path fill-rule="evenodd" d="M7.646 2.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 3.707 2.354 9.354a.5.5 0 1 1-.708-.708z" />
      <path fill-rule="evenodd" d="M7.646 6.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 7.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
    </svg>,
    doubleDownArrow: <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" class="bi bi-chevron-double-down" viewBox="0 0 16 16"
      style={{ alignSelf: "center", marginLeft: "0.2rem", pointerEvents: "none" }}>
      <path fill-rule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
      <path fill-rule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
    </svg>,
    fileText: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" class="bi bi-file-text" viewBox="0 0 16 16"
      className={styles.file_text}>
      <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5M5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
    </svg>,
    files: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16"
      className={styles.files}>
      <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    </svg>,
    saves: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16"
      className={styles.saves}>
      <path d="M11 2H9v3h2z" />
      <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
    </svg>,
    cancel: <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"
      className={styles.cancel}>
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
    </svg>
  }
  const [todos, setTodos] = useState("")
  const limit = 5

  const [currentTodo, setCurrentTodo] = useState("")
  const [numberOfTodos, setNumberOfTodos] = useState(0)

  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const changeCurrentPageNumber = (pageNumber) => {
    if (pageNumber > Math.ceil(todos.length / limit)) {
      pageNumber = Math.ceil(todos.length / limit)
    }
    if (pageNumber < 1) {
      pageNumber = 1
    }
    setCurrentPageNumber(pageNumber)
  }

  const getTodos = async (uid = undefined) => {
    const todoCollection = collection(db, "todos")
    if (uid) {
      const dt = query(todoCollection, where("uid", "==", uid))
      const getCurrentTodo = async () => {
        await getDocs(dt).then(
          (res) => {
            let tmp = res.docs[0].data()
            setCurrentTodo(tmp)
            console.log("tmp", currentTodo)
            console.log(editMode)
          }
        )
      }
      getCurrentTodo()
      return;
    }


    let result = [];

    getDocs(todoCollection).then(
      (res) => {
        res.forEach((r) => {
          result = [...result, r.data()]
        })

        if (!sortFilters.all) {
          if (!sortFilters.solved && !sortFilters.notSolved) {
            result = []
            setNumberOfTodos(result.length)
            setTodos(result)
            return
          }
          else {
            if (sortFilters.solved) {
              result = result.filter((r) => r.isSolved === true)
            }
            else {
              result = result.filter((r) => r.isSolved === false)
            }
          }
        }

        console.log(result)
        console.log(result.length)
        setNumberOfTodos(result.length)
        if (sortFilters.recent === true) {
          result.sort((a, b) => b["modifiedAt"] - a["modifiedAt"])
        }
        else {
          result.sort((a, b) => a["modifiedAt"] - b["modifiedAt"])
        }
        result.forEach((res, idx) => { res.numbering = idx + 1 })
        setTodos(result);
      }
    )
  }

  const onClickDeleteButton = (uid) => {
    if (window.confirm("To Do를 삭제하시겠습니까?")) {
      const todosCollection = collection(db, "todos")
      const dt = query(todosCollection, where("uid", "==", uid))
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
              deleteDoc(doc(todosCollection, uid))
              // console.log("Deleted")
            }
          )
      }
      deleteDocumentFunction()
      // setCurrentSchedule(null)
      getTodos()
    }
    else {
      return;
    }
  }

  const [isEdit, setIsEdit] = useState(false)
  const [editFormCommentLength, setEditFormCommentLength] = useState(0)


  const onClickEditButton = (uid) => {
    setEditMode(!editMode)
    getTodos(uid)
  }

  const refs = {
    editTdNameRef: useRef(),
    editTdCommentRef: useRef(),
  }

  const editValidationCheck = () => {
    const cond1 = refs.editTdNameRef.current.value === currentTodo.tdName;
    const cond2 = refs.editTdCommentRef.current.value === currentTodo.tdComment;
    // console.log(!cond1 || !cond2)
    setIsEdit(!cond1 || !cond2)
  }

  const onClickSaveButton = (uid) => {
    const todosCollection = collection(db, "todos")
    const dt = query(todosCollection, where("uid", "==", uid))
    let tmpTdName = refs.editTdNameRef.current.value ? refs.editTdNameRef.current.value : currentTodo.tdName
    let tmpTdCommnet = refs.editTdCommentRef.current.value ? refs.editTdCommentRef.current.value : currentTodo.tdComment
    const saveTodoFunction = async () => {
      await getDocs(dt).then((res) => {
        updateDoc(res.docs[0].ref, {
          // isSolved: !res.docs[0].data().isSolved,
          yymmdd: dateTool().yymmdd,
          hhmm: dateTool().hhmm,
          am: dateTool().am,
          modifiedAt: new Date(),
          tdName: tmpTdName,
          tdComment: tmpTdCommnet,
        })
      })
      setEditMode(!editMode)
    }
    saveTodoFunction()
    getTodos()
  }


  useEffect(() => {
    console.log("[effect] TodoListPage - getTodos")
    getTodos()
  }, [
    sortFilters.all,
    sortFilters.solved,
    sortFilters.notSolved,
    sortFilters.recent
  ])

  useEffect(() => {
    console.log("[effect] TodoListPage")
  }, [])


  return (
    <div>
      <div>
        <TodoForm
          getTodos={getTodos}
        />
      </div>
      <div
        className="form-control"
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1.4rem",
            flex: 1
          }}>
          Todo List
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "end",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{ width: "5.5rem" }}>
              전체보기
              <input type="checkbox"
                id={"sortAll"}
                checked={sortFilters.all}
                defaultChecked={sortFilters.all}
                // defaultChecked={true}
                // onClick={(event) => onChangeSortFilter(event)}
                onChange={(event) => onChangeSortFilter(event)}
                style={{ margin: "0.2rem" }} />
            </div>
            <div
              style={{ width: "4.5rem" }}>
              해결됨
              <input type="checkbox"
                id={"sortSolved"}
                defaultChecked={sortFilters.solved}
                checked={sortFilters.solved}
                // defaultChecked={true}
                // onClick={(event) => onChangeSortFilter(event)}
                onChange={(event) => onChangeSortFilter(event)}
                style={{ margin: "0.2rem" }} />
            </div>
            <div
              style={{ width: "5.5rem" }}>
              해결안됨
              <input type="checkbox"
                id={"sortNotSolved"}
                defaultChecked={sortFilters.notSolved}
                checked={sortFilters.notSolved}
                // defaultChecked={true}
                // onClick={(event) => onChangeSortFilter(event)}
                onChange={(event) => onChangeSortFilter(event)}
                style={{ margin: "0.2rem" }} />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "5.5rem",
              justifyContent: "end",
              cursor: "pointer"
            }}
          >
            {sortFilters.recent === true
              ?
              <div
                id={"sortRecent"}
                onClick={(event) => onChangeSortFilter(event)}>
                최신순{icons.doubleDownArrow}
              </div>
              :
              <div
                id={"sortRecent"}
                onClick={(event) => onChangeSortFilter(event)}>
                오래된순{icons.doubleUpArrow}
              </div>
            }
          </div>

        </div>
      </div>

      <div
        style={
          currentTodo
            ? { display: "flex", flexDirection: "row" }
            : null
        }>
        <div
          style={
            currentTodo
              ? { flexGrow: "1" }
              : null
          }>
          {numberOfTodos > 0
            ? todos && todos.filter(
              (todo) =>
                todo.numbering >= limit * (currentPageNumber - 1) + 1
                && todo.numbering <= limit * currentPageNumber
            ).map((td) => {
              return (
                <div
                  className=""
                >
                  <ol
                    className="list-group">
                    <div
                      className="form-control"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        border: `${td.isSolved ? "1px solid dodgerblue" : "1px solid lightcoral"}`,
                        // backgroundColor:`${td.isSolved ? "azure" : "lavenderblush"}`,
                        backgroundColor: `${td.isSolved ? "azure" : "mistyrose"}`,
                        height: "10rem",
                        justifyContent: "center"
                      }}
                      key={`scheudule-${td.uid}`}
                      id={td.uid}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                        }}>
                        <div
                          style={{
                            pointerEvents: "none",
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            marginRight: "1rem",
                            color: ""
                          }}>
                          #{td.numbering}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "3",
                          }}
                        >
                          {editMode && currentTodo.uid === td.uid
                            ?
                            <>
                              <input
                                className="form-control form-control-sm"
                                style={{
                                  // pointerEvents: "none",
                                  fontWeight: "bold",
                                  marginTop: "0",
                                  fontSize: "1rem"
                                }}
                                defaultValue={td.tdName}
                                maxLength={30}
                                onChange={() => {
                                  console.log("text typing...")
                                  editValidationCheck()
                                }}
                                ref={refs.editTdNameRef}
                              />
                              <textarea
                                className="form-control form-control-sm"
                                style={{
                                  // pointerEvents: "none",
                                  // marginLeft: "0.4rem",
                                  height: "5rem",
                                  marginTop: "0.1rem",
                                  resize: "none",
                                  whiteSpace: "pre-line",
                                  // overflowY: refs.editTdCommentRef.current?.value.split('\n').length > 3 ? "scroll" : "hidden"
                                  overflowY: "auto"
                                }}
                                maxLength={150}
                                rows={5}
                                defaultValue={td.tdComment}
                                onChange={(event) => {
                                  console.log("text typing...")
                                  setEditFormCommentLength(refs.editTdCommentRef.current.value.length)
                                  editValidationCheck()
                                }}
                                ref={refs.editTdCommentRef}
                              />
                              <div
                                style={{
                                  pointerEvents: "none", color: "silver", marginLeft: "0.4rem",
                                  display: "flex",
                                  justifyContent: "space-between"
                                }}>
                                <div
                                  style={{

                                  }}
                                >
                                  Now Editing...
                                </div>
                                <div
                                  style={{
                                    marginRight: "0.5rem"
                                  }}
                                >
                                  ( {editFormCommentLength}/150 )
                                </div>
                              </div>

                            </>
                            :
                            <>
                              <div
                                style={{
                                  pointerEvents: "none",
                                  fontWeight: "bold",
                                  fontSize: "1.2rem"
                                }}>
                                {td.tdName}
                              </div>
                              {/* <div */}
                              <div
                                style={{
                                  backgroundColor: "transparent",
                                  border: "none",
                                  pointerEvents: "none",
                                  height: "5rem",
                                  marginLeft: "0.4rem",
                                  marginTop: "0.4rem",
                                  paddingBottom: 0,
                                  paddingTop: 0,
                                  whiteSpace: "pre-line",
                                  overflowY: "auto"
                                }}
                              >{td.tdComment}</div>
                              <div
                                style={{ pointerEvents: "none", color: "silver", marginLeft: "0.4rem" }}>
                                <div>
                                  {td.yymmdd} {td.hhmm} {td.am ? "AM" : "PM"} 수정됨
                                </div>
                              </div>
                            </>
                          }
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                            alignSelf: "center",
                            marginRight: "2rem",
                          }}
                        >
                          {editMode && currentTodo.uid === td.uid
                            ?
                            <>
                              <div
                                style={{
                                  cursor: isEdit ? 'pointer' : 'not-allowed',
                                  marginLeft: "2rem"
                                }}
                                onClick={() => {
                                  console.log("Test: ", isEdit)
                                  isEdit
                                    ? onClickSaveButton(td.uid)
                                    : console.log("Edit first")
                                }}
                              >{icons.saves}</div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "2rem"
                                }}
                                onClick={() => {
                                  console.log("todo detail")
                                  onClickEditButton(td.uid)
                                  // setEditMode(!editMode)
                                }}
                              >{icons.cancel}</div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "2rem"
                                }}
                                onClick={() => { onClickDeleteButton(td.uid) }}
                              >{icons.trash}</div>
                            </>
                            :
                            <>
                              {!td.isSolved ?
                                <div
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "2rem"
                                  }}
                                  onClick={() => { onChangeIsSolved(td.uid) }}
                                >{icons.check}</div>
                                :
                                <div
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "2rem"
                                  }}
                                  onClick={() => { onChangeIsSolved(td.uid) }}
                                >{icons.counterClock}</div>}
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "2rem"
                                }}
                                onClick={() => {
                                  console.log("todo detail")
                                  onClickEditButton(td.uid)
                                  // setEditMode(!editMode)
                                }}
                              >{icons.fileText}</div>
                              <div
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "2rem"
                                }}
                                onClick={() => { onClickDeleteButton(td.uid) }}
                              >{icons.trash}</div>
                            </>
                          }
                        </div>

                      </div>

                    </div>

                  </ol>
                </div>
              )
            })
            : <div>

              <ol
                className="list-group">
                <div
                  className="form-control"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  No Data
                </div>
              </ol>
            </div>
          }
        </div>
      </div>

      {todos.length
        ?
        <Pagination
          currentPageNumber={currentPageNumber}
          numberOfPages={todos.length}
          changeCurrentPageNumber={changeCurrentPageNumber}
          limit={limit}
        />
        : null}
    </div>
  )
}

export default TodoListPage