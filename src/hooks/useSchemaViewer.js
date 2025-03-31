import { useState, useEffect } from "react";

/**
 * Custom hook for managing schema viewer logic
 * @param {Object} schema - Database schema object
 * @returns {Object} State and handlers for schema viewer
 */
const useSchemaViewer = (schema = {}) => {
  const [expandedTable, setExpandedTable] = useState(null);

  // Auto-open the first table when component mounts or schema changes
  useEffect(() => {
    if (schema && Object.keys(schema).length > 0) {
      setExpandedTable(Object.keys(schema)[0]);
    }
  }, [schema]);

  // Toggle table expansion
  const toggleTable = (tableName) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  return {
    expandedTable,
    toggleTable,
  };
};

export default useSchemaViewer;
