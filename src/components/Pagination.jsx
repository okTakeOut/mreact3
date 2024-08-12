const Pagination = ({ currentPageNumber, numberOfPages, changeCurrentPageNumber, limit }) => {
  const pageSets = Math.ceil(numberOfPages / limit);
  const currentSet = Math.ceil(currentPageNumber / limit);
  const startPageOfSet = (currentSet - 1) * limit + 1;


  return (
    <div aria-label="..." className=""
      style={{
        marginTop: "1rem",
        marginBottom: "1rem",
        display: "block",
        flexDirection: "column"
      }}>
      <ul className="pagination">
        <li className={`${currentPageNumber === 1 ? "visually-hidden" : ""} "page-item disabled" `}
          style={{ cursor: "pointer" }}
          onClick={() => changeCurrentPageNumber(currentPageNumber - limit)}>
          <a className="page-link">Previous</a>
        </li>

        {Array(pageSets)
          .fill(startPageOfSet)
          .map((value, index) => value + index)
          .map((pageNumber) => {
            return (
              pageNumber > pageSets ? null :
                <li
                  key={pageNumber}
                  className={`page-item ${currentPageNumber === pageNumber ? "active" : ""
                    }`}
                >
                  <div
                    className="page-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeCurrentPageNumber(pageNumber)}
                  >
                    {pageNumber}
                  </div>
                </li>
            );
          })}

        <li className={`${currentPageNumber === pageSets ? "visually-hidden" : ""} "page-item disabled" `}
          style={{ cursor: "pointer" }}
          onClick={() => changeCurrentPageNumber(currentPageNumber + limit)}
        >
          <a className="page-link">Next</a>
        </li>
      </ul>
    </div>
  )
}

export default Pagination;