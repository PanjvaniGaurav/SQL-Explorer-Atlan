import { useState, useRef } from "react";
import { toast } from "react-toastify";
import useToastNotifications from "./useToastNotifications";

/**
 * Custom hook for managing query results state
 * @returns {Object} Query results state and handlers
 */
const useQueryResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ columns: [], data: [] });
  const [isFirstExecution, setIsFirstExecution] = useState(true);
  const lastExecutedQuery = useRef(null);
  const [lastSuccessfulSelectQuery, setLastSuccessfulSelectQuery] =
    useState(null);
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

    // Update first execution flag
    if (isFirstExecution) {
      setIsFirstExecution(false);
    }

    return execTime;
  };

  // Handle execution error
  const handleError = (error, query = null) => {
    // Format user-friendly error message
    const errorMessage = error.message || "Unknown error occurred";

    // Create a UI-friendly error message
    let displayError = `Error executing SQL query: ${errorMessage}`;

    // Check if we should suppress toast for this error
    // Suppress toast for semicolon/syntax errors and table not found errors
    const shouldSuppressToast =
      errorMessage.includes("SEMICOLON") ||
      errorMessage.includes("Parse error on line") ||
      (errorMessage.includes("Table") && errorMessage.includes("not found")) ||
      errorMessage.includes("Cannot find table") ||
      errorMessage.includes("no such table");

    setError(displayError);
    setResults({ columns: [], data: [] });

    // Don't update lastExecutedQuery on error
    // But do update first execution flag
    if (isFirstExecution) {
      setIsFirstExecution(false);
    }

    // Use appropriate toast notification based on error type
    if (
      errorMessage.includes("Parse error") ||
      errorMessage.includes("Expecting") ||
      errorMessage.includes("SEMICOLON")
    ) {
      // Syntax errors should be shown in the UI instead of toast
      toastNotifications.notifySyntaxError(errorMessage, shouldSuppressToast);
    } else if (
      (errorMessage.includes("Table") && errorMessage.includes("not found")) ||
      errorMessage.includes("Cannot find table") ||
      errorMessage.includes("no such table")
    ) {
      // Table not found errors should be shown in the UI instead of toast
      toastNotifications.notifySyntaxError(errorMessage, shouldSuppressToast);
    } else {
      // Other errors should still show a toast
      toastNotifications.notifyQueryError(errorMessage);
    }

    return errorMessage;
  };

  // Complete execution (success or error)
  const completeExecution = () => {
    setIsLoading(false);
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
    lastSuccessfulSelectQuery,

    // Action handlers
    startExecution,
    handleSuccess,
    handleError,
    completeExecution,
    isQueryUnchanged,
    setError,

    // References
    lastExecutedQuery,
  };
};

export default useQueryResults;
