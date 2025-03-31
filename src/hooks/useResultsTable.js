import { useState, useEffect } from "react";

/**
 * Custom hook for managing data table functionality
 * @param {Array} initialData - Initial data array
 * @param {Array} initialColumns - Initial column definitions
 * @param {string} initialSearchTerm - Initial search term
 * @returns {Object} Table state and handlers
 */
const useResultsTable = (
  initialData = [],
  initialColumns = [],
  initialSearchTerm = ""
) => {
  // Data state
  const [data, setData] = useState(initialData);
  const [tableColumns, setTableColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // UI state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [columnWidths, setColumnWidths] = useState({});

  // Update data when props change
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // Update search term when prop changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Generate columns from data if not provided
  useEffect(() => {
    if (initialColumns.length > 0) {
      // Use provided columns
      const formattedColumns = initialColumns.map((col) => ({
        key: col,
        label: col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, " "),
      }));
      setTableColumns(formattedColumns);
    } else if (data && data.length > 0) {
      // Generate columns from first row of data
      const firstRow = data[0];
      const generatedColumns = Object.keys(firstRow).map((key) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      }));
      setTableColumns(generatedColumns);
    } else {
      setTableColumns([]);
    }
  }, [data, initialColumns]);

  // Initialize column widths
  useEffect(() => {
    if (tableColumns.length > 0 && Object.keys(columnWidths).length === 0) {
      const initialWidths = {};
      tableColumns.forEach((column) => {
        initialWidths[column.key] =
          column.key === tableColumns[0].key ? 180 : 150;
      });
      setColumnWidths(initialWidths);
    }
  }, [tableColumns, columnWidths]);

  // Update filtered data when data, searchTerm, or sortConfig changes
  useEffect(() => {
    let filtered = [...data];

    // Apply search filter
    if (searchTerm && tableColumns.length > 0) {
      filtered = filtered.filter((row) => {
        return tableColumns.some((column) => {
          const value = row[column.key];
          return (
            value !== undefined &&
            value !== null &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, searchTerm, sortConfig, tableColumns]);

  // Handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page, totalPages) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleColumnResize = (columnKey, width) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: width,
    }));
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return {
    tableColumns,
    filteredData,
    paginatedData,
    searchTerm,
    sortConfig,
    currentPage,
    rowsPerPage,
    columnWidths,
    totalPages,
    startIndex,
    handleSearchChange,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    handleColumnResize,
  };
};

export default useResultsTable;
