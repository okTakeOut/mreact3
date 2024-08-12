import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase';

const UserInformation = ({ isLoggedIn }) => {
  const tag = "[UserInfo]"
  const loggedIn = isLoggedIn;
  const userDetails = useSelector((state) => state.fb.authState.userDetails)
  loggedIn && console.log(userDetails)

  useEffect(() => {
    console.log("[UserInfo] Effect: ", userDetails)
  }, [userDetails])

  return (
    <>
      <div>User Profile</div>
      <div className="btn btn-success" onClick={() => console.log(userDetails)}>Button</div>
      <div className="btn btn-success" onClick={() => console.log(tag, "Btn2: ", auth.currentUser)}>Button2</div>
      <hr />
      <div className="d-flex flex-column">
        <div className="" style={{ fontWeight: "bold" }}>
          Firebase User Details
        </div>

        <div>uid : {userDetails?.uid || "Not Found"}</div>
        <div>displayName : {userDetails?.displayName || "Not Found"}</div>
        <div>lastAccess : {userDetails?.lastAccess || "Not Found"}</div>
        <div>todayPosting : {String(userDetails?.todayPosting) || "Not Found"}</div>
        <hr />

        <div className="" style={{ fontWeight: "bold" }}>
          GetAuth User Details
        </div>
        <div>uid : {loggedIn && auth?.currentUser?.uid || "Not Found"}</div>
        <div>displayName : {loggedIn && auth?.currentUser?.displayName || "Not Found"}</div>
        <div>lastAccess : {loggedIn && auth?.currentUser?.lastAccess || "Not Found"}</div>
        <div>todayPosting : {loggedIn && String(auth?.currentUser?.todayPosting) || "Not Found"}</div>
      </div>
    </>
  )
}

export default UserInformation;