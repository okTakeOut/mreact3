import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import logo from "../img/bg/logolong.png"

const Navbar = () => {
  const navigate = useNavigate();
  const goHome = () => {
    return (
      navigate("/")
    )
  }
  const user = auth.currentUser
  return (
    <div>
      <nav className="navbar navbar-expand-lg"
        style={{
          paddingBottom: "0.8rem",
          marginBottom: "0.5rem",
        }}
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/" onClick={goHome}>
            <img src={logo} width="64rem" height="28rem" alt="" />
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" style={{ fontWeight: "bold" }} aria-current="page" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/signup"
                  style={({ isActive }) => {
                    return {
                      borderBottom: isActive ? "double violet" : "",
                    }
                  }}>
                  {`Sign Up`}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/schedules"
                  style={({ isActive }) => {
                    return {
                      borderBottom: isActive ? "double violet" : "",
                    }
                  }}>
                  {`Schedules`}
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/settings"
                  style={({ isActive }) => {
                    return {
                      borderBottom: isActive ? "double violet" : "",
                    }
                  }}>
                  {`Settings`}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/todo"
                  style={({ isActive }) => {
                    return {
                      borderBottom: isActive ? "double violet" : "",
                    }
                  }}>
                  {`To Do`}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/about"
                  style={({ isActive }) => {
                    return {
                      borderBottom: isActive ? "double violet" : "",
                    }
                  }}>
                  {`About`}
                </NavLink>
              </li>

            </ul>
            {
              user
                ?
                <div className="d-flex flex-row">
                  <div
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column"
                    }}
                  >Hi {user?.displayName}</div>
                  <div className="btn btn-sm btn-secondary ms-2"
                    onClick={() => {
                      auth.signOut()
                      // dispatch logout
                    }}
                  >LogOut</div>
                </div>
                : <div
                  className="btn btn-sm btn-secondary ms-2"
                  onClick={() => { navigate("/login") }}>
                  LoginPage
                </div>
            }
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;