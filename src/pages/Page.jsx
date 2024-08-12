import pageStyles from "./Page.module.css";
const Page = ({ children, pageName }) => {
  return (
    <div className="container">
      <div className={`form ${pageStyles.page_0}`}>
        <div className={pageStyles.page_1}>
          {
            pageName &&
            <>
              <div className={pageStyles.page_2}>
                <div className={pageStyles.page_header}>
                  {pageName}
                </div>
              </div>
              <hr />
            </>
          }
          {children}
        </div>
      </div>
    </div>
  )
}

export default Page;
// const Page = ({ children }) => {
//   return (
//     <>{children}</>
//   )
// }

// export default Page;