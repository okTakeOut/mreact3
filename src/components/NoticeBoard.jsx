import { useNavigate } from 'react-router-dom';
import styles from "./NoticeBoard.module.css";

const NoticeBoard = ({ boardData }) => {
  const navigate = useNavigate()
  const isListPage = boardData.listPage

  return (
    <div className="container">
      <div
        style={{
          paddingBottom: "0.5rem",
          borderBottom: "1px solid black",
          marginBottom: "0.5rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
          }}
        >{boardData.title || "Set ListName"}</div>
        <div
          style={{
            display: "flex",

          }}
        >
          <div className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              navigate(`${boardData?.more}`)
            }}
          >More</div>
        </div>
      </div>
      {
        boardData?.data?.slice(0, boardData.listSize || 4)?.map((listItem) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => { 
                isListPage ? navigate(`${boardData?.more}`) : navigate(`/details/${listItem.dataUid}`) }}
            >
              <div
                className={styles.nbItem}
              >{listItem.dataName}</div>
            </div>
          )
        })
      }
    </div>
  )
}

export default NoticeBoard