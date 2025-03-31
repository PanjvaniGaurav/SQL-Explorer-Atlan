import { useEffect } from "react";
import { toast } from "react-toastify";
import useLocalStorage from "./useLocalStorage";

/**
 * Custom hook for managing saved queries
 * @param {Array} predefinedQueries - Array of predefined queries to include
 * @returns {Object} Saved queries state and handlers
 */
const useSavedQueries = (predefinedQueries = []) => {
  const [savedQueries, setSavedQueries] = useLocalStorage("savedQueries", []);

  // Initialize with predefined queries on mount
  useEffect(() => {
    // Format predefined queries
    const formattedPredefined = predefinedQueries.map((query) => ({
      id: query.id,
      name: query.name,
      query: query.query,
      timestamp: new Date().toLocaleString(),
      isPredefined: true,
    }));

    // Get only custom (non-predefined) queries from saved queries
    const customQueries = savedQueries.filter(
      (q) => q && !q.isPredefined && q.id && String(q.id).startsWith("custom-")
    );

    // Combine predefined queries with custom ones
    const combinedQueries = [...formattedPredefined, ...customQueries];

    setSavedQueries(combinedQueries);
  }, []);

  // Check if a query is already saved
  const isQuerySaved = (query) => {
    return savedQueries.some((savedQuery) => savedQuery.query === query);
  };

  // Check if a query name is already used
  const isNameTaken = (name) => {
    return savedQueries.some((savedQuery) => savedQuery.name === name);
  };

  // Save a new query
  const saveQuery = (query, queryName) => {
    try {
      // Check if query is already saved
      if (!isQuerySaved(query)) {
        if (queryName) {
          // Check if name is already taken
          if (isNameTaken(queryName)) {
            toast.error("A query with this name already exists. Please choose a different name.");
            // Prompt for a new name with the original name shown
            const newName = prompt(`Enter a different name for this query (original name: "${queryName}"):`);
            if (newName) {
              // Recursively try to save with the new name
              return saveQuery(query, newName);
            }
            return false;
          }

          // Create a new custom query
          const newSavedQuery = {
            id: `custom-${Date.now()}`,
            name: queryName,
            query: query,
            timestamp: new Date().toLocaleString(),
            isPredefined: false,
          };

          // Add to existing queries
          const updatedQueries = [...savedQueries, newSavedQuery];
          setSavedQueries(updatedQueries);

          // Save to localStorage
          localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));

          // Dispatch a storage event to notify other components
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "savedQueries",
              newValue: JSON.stringify(updatedQueries),
            })
          );

          // Show success toast
          toast.success("Query saved successfully");

          return true;
        }
      } else {
        toast.info("This query is already saved");
        return false;
      }
    } catch (error) {
      console.error("Error saving query:", error);
      toast.error(`Failed to save query: ${error.message}`);
      return false;
    }

    return false;
  };

  // Delete a saved query
  const deleteSavedQuery = (index) => {
    try {
      const queryToDelete = savedQueries[index];

      // Don't allow deletion of predefined queries
      if (queryToDelete?.isPredefined) {
        toast.info("Predefined example queries cannot be deleted");
        return false;
      }

      // Create a new array without the deleted query
      const updatedQueries = savedQueries.filter((_, i) => i !== index);

      // Update state
      setSavedQueries(updatedQueries);

      // Save to localStorage
      localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));

      // Dispatch a storage event to notify other components
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "savedQueries",
          newValue: JSON.stringify(updatedQueries),
        })
      );

      // Show deletion toast
      toast.error("Saved query deleted");

      return queryToDelete;
    } catch (error) {
      toast.error(`Failed to delete query: ${error.message}`);
      return false;
    }
  };

  return {
    savedQueries,
    saveQuery,
    deleteSavedQuery,
    isQuerySaved,
  };
};

export default useSavedQueries;
