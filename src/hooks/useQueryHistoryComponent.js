import { toast } from "react-toastify";

/**
 * Custom hook for managing query history in the QueryHistory component
 * @param {Array} history - The query history array
 * @param {Function} onSelectQuery - Callback for selecting a query
 * @param {Function} onDeleteQuery - Callback for deleting a query
 * @returns {Object} Handlers for query history operations
 */
const useQueryHistoryComponent = (history, onSelectQuery, onDeleteQuery) => {
  const handleQuerySelect = (query) => {
    // Only call parent handler if provided
    if (onSelectQuery) {
      onSelectQuery(query);
    }
  };

  // Add a handler for deleting from history
  const handleDeleteQuery = (index) => {
    // Only call parent handler if provided
    if (onDeleteQuery) {
      onDeleteQuery(index);
    }
  };

  return {
    handleQuerySelect,
    handleDeleteQuery,
  };
};

export default useQueryHistoryComponent;
