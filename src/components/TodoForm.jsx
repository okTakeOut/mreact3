import { useRef, useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './../firebase';
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

const TodoForm = ({ getTodos }) => {
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

  const refs = {
    newTodoRef: useRef(),
    commentRef: useRef(),
  }

  const refsOnChange = (event) => {
    if (event.target.id === "newTodoref") {
      return
    }
  }

  const [todoFormData, setTodoFormData] = useState({
    tdName: "",
    tdComment: "",
  })

  const [todoFormLength, setTodoFormLength] = useState({
    tdName: 0,
    tdComment: 0,
  })

  const resetTodoFormData = () => {
    setTodoFormData({
      tdName: "",
      tdComment: "",
    });
  }

  const onChangeValue = (event) => {
    setTodoFormData((prev) => {
      return (
        {
          ...prev,
          [event.target.id]: event.target.value
        }
      )
    })
    setTodoFormLength((prev) => {
      return ({
        ...prev,
        [event.target.id]: event.target.value.length
      })
    })
  }

  const registNewTodoButton = () => {
    if(!refs.commentRef.current.value && !refs.newTodoRef.current.value){
      window.alert("blank todo")
      return
    }
    const todosCollection = collection(db, "todos")
    const registTodos = async () => {
      const uid = uuid()
      await setDoc(doc(todosCollection, uid), {
        uid: uid,
        tdName: todoFormData.tdName,
        tdComment: todoFormData.tdComment,
        yymmdd: dateTool().yymmdd,
        hhmm: dateTool().hhmm,
        am: dateTool().am,
        isSolved: false,
        modifiedAt: new Date(),
      })
    }
    registTodos()
    refs.newTodoRef.current.value = ""
    refs.commentRef.current.value = ""
    getTodos()
  }
  // const registNewTodoButton = () => {
  //   const todosCollection = collection(db, "todos")
  //   const registTodos = async () => {
  //     const uid = uuid()
  //     await setDoc(doc(todosCollection, uid), {
  //       uid: uid,
  //       tdName: todoFormData.tdName,
  //       tdComment: todoFormData.tdComment,
  //       yymmdd: dateTool().yymmdd,
  //       hhmm: dateTool().hhmm,
  //       am: dateTool().am,
  //       isSolved: false,
  //       modifiedAt: new Date(),
  //     })
  //   }
  //   registTodos()
  // }

  useEffect(() => {
    console.log("GET TODOS")
    getTodos()
  }, [])

  return (
    <div>
      <div
        className="form-group">
        <div className="form-control">
          <div
            style={{
              fontWeight: "bolder",
            }}
          >
            New Todo
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "0.5rem",
              }}
            >
              <input
                className="form-control"
                style={{
                  marginBottom: "1rem"
                }}
                placeholder={"New To Do (최대 30자)"}
                id={"tdName"}
                ref={refs.newTodoRef}
                onChange={(event) => { onChangeValue(event) }}
                required={true}
                maxLength={30}
              />
              Comment ({todoFormLength.tdComment}/150)
              <textarea
                className="form-control"
                style={{
                  marginTop: "0.5rem",
                  marginBottom: "0.5rem"
                }}
                rows={4}
                id={"tdComment"}
                ref={refs.commentRef}
                onChange={(event) => { onChangeValue(event) }}
                placeholder={"Comment"}
                maxLength={150}
              // required={true}
              />
              <div className="btn btn-outline-primary"
                onClick={() => { registNewTodoButton() }}
              >Regist</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    </div>
  )
}

export default TodoForm