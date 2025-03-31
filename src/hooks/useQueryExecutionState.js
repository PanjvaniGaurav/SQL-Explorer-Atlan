import { useState, useRef } from "react";
import useToastNotifications from "./useToastNotifications";
import useLocalStorage from "./useLocalStorage";

/**
 * Custom hook for managing the UI state related to query execution
 * @returns {Object} Query execution state and handlers
 */
const useQueryExecutionState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ columns: [], data: [] });
  const [isFirstExecution, setIsFirstExecution] = useState(true);
  const lastExecutedQuery = useRef(null);
  const [lastSuccessfulSelectQuery, setLastSuccessfulSelectQuery] =
    useLocalStorage("lastSuccessfulSelectQuery", null);
  const toastNotifications = useToastNotifications();

  // Start query execution
  const startExecution = () => {
    setIsLoading(true);
    setError(null);
    return performance.now();
  };

  // Handle successful execution
  const handleSuccess = (queryResult, query, startTime) => {
    // Process the result
    if (queryResult && queryResult.length > 0) {
      const columns = Object.keys(queryResult[0]);
      setResults({
        columns,
        data: queryResult,
      });
    } else {
      // Handle empty results
      setResults({ columns: [], data: [] });
    }

    // Calculate and set execution time
    const endTime = performance.now();
    const execTime = (endTime - startTime) / 1000; // Convert to seconds
    setExecutionTime(execTime);

    // Store the successfully executed query
    lastExecutedQuery.current = query;

    return {
      executionTime: execTime,
      isFirstExecution,
    };
  };

  // Handle execution error
  const handleError = (error) => {
    setError(`Error executing SQL query: ${error.message}`);
    setResults({ columns: [], data: [] });
    lastExecutedQuery.current = null;
    return error.message;
  };

  // Complete execution (success or error)
  const completeExecution = () => {
    setIsLoading(false);
    if (isFirstExecution) {
      setIsFirstExecution(false);
    }
  };

  // Check if query is unchanged
  const isQueryUnchanged = (query) => {
    return !isFirstExecution && query === lastExecutedQuery.current;
  };

  return {
    // State
    isLoading,
    executionTime,
    error,
    results,
    isFirstExecution,

    // Action handlers
    startExecution,
    handleSuccess,
    handleError,
    completeExecution,
    isQueryUnchanged,

    // References
    lastExecutedQuery,
    lastSuccessfulSelectQuery,
    setLastSuccessfulSelectQuery,
  };
};

export default useQueryExecutionState;
