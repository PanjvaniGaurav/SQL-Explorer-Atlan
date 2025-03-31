import { useState, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import useTabs from "./useTabs";
import useQueryExecution from "./useQueryExecution";
import useQueryHistory from "./useQueryHistory";
import useSavedQueries from "./useSavedQueries";
import useToastNotifications from "./useToastNotifications";

/**
 * Custom hook for managing global application state
 * @param {Array} initialQueries - Initial predefined queries
 * @param {string} initialQuery - The initial query to load
 * @returns {Object} Global application state and handlers
 */
const useAppState = (initialQueries = [], initialQuery = "") => {
  // Core state
  const { activeTab, setActiveTab } = useTabs("results");
  const [searchTerm, setSearchTerm] = useState("");
  const [initialQueryExecuted, setInitialQueryExecuted] = useState(false);
  const [currentQuery, setCurrentQuery] = useLocalStorage(
    "currentQuery",
    initialQuery
  );

  // Feature hooks
  const { queryHistory, addToHistory, deleteFromHistory, updateSavedStatus } =
    useQueryHistory(15);
  const { savedQueries, saveQuery, deleteSavedQuery, isQuerySaved } =
    useSavedQueries(initialQueries);
  const { results, isLoading, executionTime, error, executeQuery } =
    useQueryExecution(setActiveTab, addToHistory);
  const toastNotifications = useToastNotifications();

  // Callbacks
  const handleQueryChange = useCallback(
    (newQuery) => {
      setCurrentQuery(newQuery);
    },
    [setCurrentQuery]
  );

  const handleQueryExecute = useCallback(() => {
    executeQuery(currentQuery, savedQueries, handleQueryChange);
  }, [currentQuery, executeQuery, savedQueries, handleQueryChange]);

  const executeQueryWithCallback = useCallback(
    (query, savedQueriesParam = savedQueries) => {
      executeQuery(query, savedQueriesParam, handleQueryChange);
    },
    [executeQuery, savedQueries, handleQueryChange]
  );

  const handleSelectFromHistory = useCallback(
    (query, fromSaved = false) => {
      setCurrentQuery(query);
      if (fromSaved) {
        toastNotifications.notifySavedQueryLoaded();
      } else {
        toastNotifications.notifyHistoryQueryLoaded();
      }
    },
    [setCurrentQuery, toastNotifications]
  );

  const handleSaveQuery = useCallback(
    (query) => {
      // Check if the query is already saved
      if (isQuerySaved(query)) {
        toastNotifications.notifyQueryAlreadySaved();
        return;
      }

      // Prompt for a name
      const queryName = prompt("Enter a name for this query:");
      if (queryName) {
        const saved = saveQuery(query, queryName);
        if (saved) {
          updateSavedStatus(query, true);
        }
      }
    },
    [saveQuery, updateSavedStatus, isQuerySaved, toastNotifications]
  );

  const handleDeleteSavedQuery = useCallback(
    (index) => {
      const deletedQuery = deleteSavedQuery(index);
      if (deletedQuery) {
        updateSavedStatus(deletedQuery.query, false);
      }
    },
    [deleteSavedQuery, updateSavedStatus]
  );

  const handleDeleteFromHistory = useCallback(
    (index) => {
      deleteFromHistory(index);
    },
    [deleteFromHistory]
  );

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  return {
    // State
    activeTab,
    currentQuery,
    searchTerm,
    queryHistory,
    savedQueries,
    results,
    isLoading,
    executionTime,
    error,
    initialQueryExecuted,

    // Actions
    setActiveTab,
    setInitialQueryExecuted,
    handleQueryChange,
    handleQueryExecute,
    handleSelectFromHistory,
    handleSaveQuery,
    handleDeleteSavedQuery,
    handleDeleteFromHistory,
    handleSearch,
    executeQuery,
    executeQueryWithCallback,
  };
};

export default useAppState;
