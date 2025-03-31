import useLocalStorage from "./useLocalStorage";

/**
 * Custom hook for managing query history with a maximum limit
 * @param {number} maxHistoryEntries - Maximum number of history entries to keep
 * @returns {Object} History state and handlers
 */
const useQueryHistory = (maxHistoryEntries = 15) => {
  const [queryHistory, setQueryHistory] = useLocalStorage("queryHistory", []);

  // Add a new query to history
  const addToHistory = (historyItem) => {
    setQueryHistory((prevHistory) => {
      const newHistory = [historyItem, ...prevHistory];
      // If we exceed the maximum, return only the most recent entries
      return newHistory.length > maxHistoryEntries
        ? newHistory.slice(0, maxHistoryEntries)
        : newHistory;
    });
  };

  // Delete a query from history
  const deleteFromHistory = (index) => {
    setQueryHistory((prevHistory) => {
      const updatedHistory = prevHistory.filter((_, i) => i !== index);

      // Save to localStorage
      localStorage.setItem("queryHistory", JSON.stringify(updatedHistory));

      // Dispatch an event to notify other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "queryHistory",
          newValue: JSON.stringify(updatedHistory),
        })
      );

      return updatedHistory;
    });
  };

  // Update saved status in history items
  const updateSavedStatus = (query, isSaved) => {
    setQueryHistory((prevHistory) =>
      prevHistory.map((item) =>
        item.query === query ? { ...item, saved: isSaved } : item
      )
    );
  };

  // Clear all history
  const clearHistory = () => {
    setQueryHistory([]);
  };

  return {
    queryHistory,
    addToHistory,
    deleteFromHistory,
    updateSavedStatus,
    clearHistory,
  };
};

export default useQueryHistory;
