import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from 'react';
import { collection, where, query, getDocs } from 'firebase/firestore';
import { db } from './../firebase';
import { useState } from 'react';

const ScheduleDetailPage = () => {
  let { id } = useParams();
  const [currSchedule, setCurrSchedule] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    const getCurr = () => {
      const scheduleCollection = collection(db, "schedules")
      const dt = query(scheduleCollection, where("uid", "==", id))
      let result = []
      getDocs(dt).then(
        (res) => {
          result = [...result, res.docs[0].data()]
          setCurrSchedule(result[0])
        }
      )
    }
    console.log("[details]", id)
    console.log("[details]", currSchedule)
    getCurr()
  }, [])
  return (
    <div>
      {currSchedule
        ?
        <div>
          <div className="form">
            <div className="container mt-3">
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
                    value={currSchedule.scheduleName}
                    disabled
                  // id="fScheduleName"
                  // onChange={(event) => onChangeValue(event)}
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
                    disabled value={currSchedule.hostName} />

                  <div className="" style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center"
                  }}>
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
                        value={currSchedule.startDate}
                        disabled
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
                        value={currSchedule.endDate}
                        disabled
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
                    <input
                      className="form-select"
                      value={currSchedule.buildingNumber}
                      disabled
                    />
                    <div style={{ padding: "0 1rem" }}></div>
                    <input
                      className="form-select"
                      value={currSchedule.roomNumber}
                      disabled
                    />

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
                    type="text"
                    style={{ marginBottom: "1rem", }}
                    rows={6}
                    value={currSchedule.memo}
                    disabled
                  ></textarea>
                  <div className="d-flex flex-column justify-content-center"
                    style={{ alignContent: "center" }}
                  >
                    <div className="btn btn-lg btn-dark mt-3"
                      onClick={() => navigate(`/schedules`)}
                    >
                      go back to the list
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div>Not Found</div>
      }
    </div>
  )
}

export default ScheduleDetailPage