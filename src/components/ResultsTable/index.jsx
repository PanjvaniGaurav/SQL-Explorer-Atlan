import React, { useRef } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaDownload,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import useResultsTable from "../../hooks/useResultsTable";
import "./styles.css";

const ResultsTable = ({
  data = [],
  columns = [],
  isLoading = false,
  searchTerm = "",
  onSearch,
}) => {
  // Use the custom hook for table logic
  const {
    tableColumns,
    filteredData,
    paginatedData,
    searchTerm: localSearchTerm,
    sortConfig,
    currentPage,
    rowsPerPage,
    columnWidths,
    totalPages,
    startIndex,
    handleSearchChange: setLocalSearchTerm,
    handleSort: requestSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnResize,
  } = useResultsTable(data, columns, searchTerm);

  // DOM refs
  const tableRef = useRef(null);
  const resizingColumnRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Debounced toast for search results
  React.useEffect(() => {
    if (localSearchTerm && localSearchTerm.trim() !== "") {
      const timer = setTimeout(() => {
        toast.info(`Found ${filteredData.length} matching results`);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [filteredData, localSearchTerm]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort size={16} />;
    if (sortConfig.direction === "ascending") return <FaSortUp size={16} />;
    return <FaSortDown size={16} />;
  };

  // Handlers for column resizing
  const handleResizeStart = (e, columnKey) => {
    e.preventDefault();
    e.stopPropagation();

    document.body.style.cursor = "col-resize";
    resizingColumnRef.current = columnKey;
    startXRef.current = e.clientX;
    startWidthRef.current = columnWidths[columnKey] || 150;

    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", handleResizeEnd);
  };

  const handleResizeMove = (e) => {
    if (!resizingColumnRef.current) return;

    const diffX = e.clientX - startXRef.current;
    const newWidth = Math.max(80, startWidthRef.current + diffX);

    handleColumnResize(resizingColumnRef.current, newWidth);
  };

  const handleResizeEnd = () => {
    document.body.style.cursor = "";
    resizingColumnRef.current = null;

    window.removeEventListener("mousemove", handleResizeMove);
    window.removeEventListener("mouseup", handleResizeEnd);
  };

  // Add event listeners cleanup
  React.useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, []);

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages === 0) return null;

    // Always show first page, last page, current page, and some pages around current
    if (totalPages <= maxVisiblePages) {
      // If we have fewer pages than the max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i, totalPages)}
          >
            {i}
          </button>
        );
      }
    } else {
      // Complex pagination with ellipses

      // Always add first page
      pages.push(
        <button
          key={1}
          className={`page-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => handlePageChange(1, totalPages)}
        >
          1
        </button>
      );

      // Calculate the range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, 4);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Add ellipsis if there's a gap after first page
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-1" className="page-ellipsis">
            ...
          </span>
        );
      }

      // Add the pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`page-button ${currentPage === i ? "active" : ""}`}
            onClick={() => handlePageChange(i, totalPages)}
          >
            {i}
          </button>
        );
      }

      // Add ellipsis if there's a gap before last page
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-2" className="page-ellipsis">
            ...
          </span>
        );
      }

      // Always add last page
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            className={`page-button ${
              currentPage === totalPages ? "active" : ""
            }`}
            onClick={() => handlePageChange(totalPages, totalPages)}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pages;
  };

  // Prepare CSV data for export
  const csvData = filteredData.map((row) => {
    const csvRow = {};
    tableColumns.forEach((col) => {
      csvRow[col.label] = row[col.key];
    });
    return csvRow;
  });

  const handleExportCSV = () => {
    toast.success(`Exported ${filteredData.length} rows to CSV`);
  };

  // If loading, show loading indicator
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Results</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  // If there's no data or columns, show a message
  if (
    !data ||
    data.length === 0 ||
    !tableColumns ||
    tableColumns.length === 0
  ) {
    return (
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Results</h2>
        </div>
        <div className="no-data-message">No data available</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Results</h2>
        <div className="table-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search results..."
              value={localSearchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <CSVLink
            data={csvData}
            filename="sql_result.csv"
            className="export-button"
            target="_blank"
            onClick={handleExportCSV}
          >
            <FaDownload size={14} />
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="table-wrapper" ref={tableRef}>
        <table className="styled-table">
          <thead className="table-head">
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column.key}
                  className="table-header-cell"
                  style={{ width: `${columnWidths[column.key] || 150}px` }}
                  onClick={() => requestSort(column.key)}
                >
                  <div className="header-content">
                    <span className="header-label" title={column.label}>
                      {column.label}
                      <span className="sort-icon">
                        {getSortIcon(column.key)}
                      </span>
                    </span>
                  </div>
                  <div
                    className="column-resize-handle"
                    onMouseDown={(e) => handleResizeStart(e, column.key)}
                  ></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {isLoading ? (
              <tr>
                <td colSpan={tableColumns.length} className="loading-message">
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length} className="no-results">
                  No results found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {tableColumns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="table-cell"
                      style={{ width: `${columnWidths[column.key] || 150}px` }}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Make sure we don't render pagination or any stray values when there's no data */}
      {filteredData && filteredData.length > 0 && Number(totalPages) > 0 ? (
        <div className="pagination">
          <div className="page-info">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>

          <div className="rows-per-page-container">
            <span className="rows-per-page-label">Rows per page:</span>
            <select
              className="rows-per-page-select"
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(e.target.value)}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="page-controls">
            <button
              className="page-button prev-button"
              onClick={() => handlePageChange(currentPage - 1, totalPages)}
              disabled={currentPage === 1}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                fontWeight: "bold",
              }}
            >
              &lt;
            </button>

            {renderPageNumbers()}

            <button
              className="page-button next-button"
              onClick={() => handlePageChange(currentPage + 1, totalPages)}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: "#3498db",
                color: "white",
                fontWeight: "bold",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ResultsTable;
