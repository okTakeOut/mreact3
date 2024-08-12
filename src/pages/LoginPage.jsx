const LoginPage = () => {
  const Star = () => {
    return (
      <div style={{
        color: "tomato",
        marginRight:"0.2rem",
        }}>*</div>
    )
  }
  return (
    <div
      style={{
        height: "100%",
        paddingTop: "5rem",
        paddingBottom: "5rem",
      }}
    >
      <div className="form-group"
        style={{
          display: "flex",
          justifyContent: "center",
        }}>
        <div className="form-control"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
          }}>
          <div className="form-label" style={{ display: "flex", flexDirection:"row",alignContent:"center" }}>
            <Star />ID</div><input className="form-control form-text" />
          <div className="form-label" style={{ display: "flex" }}>
            <Star />Password</div><input className="form-control form-text" type="password" />
          <div className="btn btn-primary"
            style={{
              display: "flex",
              marginTop: "0.5rem",
              justifyContent: "center"
            }}>Login</div>
          <hr />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textDecoration: "underline",
              textAlign: "center",
            }}>
            Don't have an account?
            <div className="btn btn-outline-dark"
              style={{
                marginTop: "0.5rem",
              }}>Join Us</div>
          </div>
        </div>
      </div>
    </div>

  )
}
export default LoginPage;