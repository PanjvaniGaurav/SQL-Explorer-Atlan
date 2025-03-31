import { useState, useEffect } from "react";
import { toast } from "react-toastify";

/**
 * Custom hook for managing saved queries in the SavedQueries component
 * @param {Array} mockQueries - Initial predefined queries
 * @param {Function} onDeleteSavedQuery - Parent delete handler
 * @returns {Object} State and handlers for saved queries
 */
const useSavedQueriesComponent = (mockQueries = [], onDeleteSavedQuery) => {
  // Local state for saved queries
  const [savedQueries, setSavedQueries] = useState([]);

  // Function to load saved queries from localStorage
  const loadSavedQueries = () => {
    try {
      // Create predefined queries array from mockQueries
      const predefinedQueries = mockQueries.map((query) => ({
        id: query.id,
        name: query.name,
        query: query.query,
        timestamp: new Date().toLocaleString(),
        isPredefined: true,
      }));

      const storedQueries = localStorage.getItem("savedQueries");

      if (storedQueries) {
        // If we have stored queries, parse them
        const parsedQueries = JSON.parse(storedQueries);

        // Get only custom (non-predefined) queries from stored queries
        const customQueries = parsedQueries.filter(
          (q) =>
            q && !q.isPredefined && q.id && String(q.id).startsWith("custom-")
        );

        // Combine predefined queries with custom ones
        const combinedQueries = [...predefinedQueries, ...customQueries];

        // Update state with combined queries
        setSavedQueries(combinedQueries);

        // Save the combined queries back to localStorage
        localStorage.setItem("savedQueries", JSON.stringify(combinedQueries));
      } else {
        // If no stored queries, initialize with predefined ones
        setSavedQueries(predefinedQueries);

        // Also save to localStorage
        localStorage.setItem("savedQueries", JSON.stringify(predefinedQueries));
      }
    } catch (error) {
      console.error("Error loading saved queries from localStorage:", error);
    }
  };

  // Load saved queries on mount
  useEffect(() => {
    loadSavedQueries();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "savedQueries") {
        loadSavedQueries();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [mockQueries]);

  // Handle query deletion
  const handleDeleteQuery = (index) => {
    const queryToDelete = savedQueries[index];

    // Don't allow deletion of predefined queries
    if (queryToDelete?.isPredefined) {
      toast.info("Predefined example queries cannot be deleted");
      return;
    }

    // Create a new array without the deleted query
    const updatedQueries = savedQueries.filter((_, i) => i !== index);

    // Update our local state
    setSavedQueries(updatedQueries);

    // Save to localStorage - ensure predefined queries are preserved
    localStorage.setItem("savedQueries", JSON.stringify(updatedQueries));

    // Notify parent component
    if (onDeleteSavedQuery) {
      onDeleteSavedQuery(index);
    }
  };

  return {
    savedQueries,
    handleDeleteQuery,
  };
};

export default useSavedQueriesComponent;
