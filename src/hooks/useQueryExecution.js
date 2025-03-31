import { useCallback } from "react";
import alasql from "alasql";
import useQueryResults from "./useQueryResults";
import { database } from "../data/database";
import { toast } from "react-toastify";

/**
 * Custom hook for handling SQL query execution
 * @param {Function} onTabChange - Function to change active tab
 * @param {Function} updateHistory - Function to update query history
 * @returns {Object} Query execution state and handler
 */
const useQueryExecution = (onTabChange, updateHistory) => {
  // Use our query results hook for state management
  const queryResults = useQueryResults();

  // Helper function to validate column names in a query
  const validateColumnNames = useCallback((query) => {
    try {
      // Skip validation for queries with JOINs as they're more complex
      if (query.toUpperCase().includes(" JOIN ")) {
        return true;
      }

      // Simple regex to extract column names from SELECT statements
      // This is a basic implementation and might need refinement for complex queries
      const selectMatch = query.match(/SELECT\s+(.*?)\s+FROM/i);
      if (!selectMatch || !selectMatch[1]) return true; // Can't extract columns
      
      const columnsStr = selectMatch[1].trim();
      if (columnsStr === '*') return true; // SELECT * is valid
      
      // Extract the table name
      const fromMatch = query.match(/FROM\s+(\w+)/i);
      if (!fromMatch || !fromMatch[1]) return true; // Can't extract table
      
      const tableName = fromMatch[1].trim();
      
      // Check if the table exists first
      if (!database[tableName]) {
        throw new Error(`Table "${tableName}" does not exist in the database. Please check the table name.`);
      }

      // Get column names from the query
      let requestedColumns = columnsStr.split(',')
        .map(col => col.trim().split(' ').shift().split('.').pop()) // Handle aliases and table.column format
        .filter(col => col !== '*');

      // Special case for COUNT(*), SUM(), etc.
      requestedColumns = requestedColumns.filter(col => {
        return !col.includes('(') && !col.includes(')') && col !== '';
      });

      // Skip if using functions or no columns to validate
      if (requestedColumns.length === 0) return true;
      
      // Get actual column names from the first row in the table
      if (database[tableName] && database[tableName].length > 0) {
        const actualColumns = Object.keys(database[tableName][0]);
        
        // Check if all requested columns exist in the actual columns (case sensitive)
        for (const col of requestedColumns) {
          if (!actualColumns.includes(col)) {
            throw new Error(`Column "${col}" does not exist in table "${tableName}". Available columns are: ${actualColumns.join(', ')}`);
          }
        }
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Main query execution function
  const executeQuery = useCallback(
    (query, savedQueries = []) => {
      // Check if query is empty
      if (!query || query.trim() === "") {
        queryResults.setError("Please enter a query to execute");
        onTabChange("results");
        return;
      }

      // Check if query is restricted (CREATE, INSERT, DROP, ALTER, UPDATE)
      const uppercaseQuery = query.toUpperCase().trim();

      // Check if this is NOT a SELECT query
      const isSelectQuery = uppercaseQuery.startsWith("SELECT ");

      if (
        !isSelectQuery ||
        uppercaseQuery.startsWith("CREATE ") ||
        uppercaseQuery.startsWith("INSERT ") ||
        uppercaseQuery.startsWith("DROP ") ||
        uppercaseQuery.startsWith("ALTER ") ||
        uppercaseQuery.startsWith("UPDATE ")
      ) {
        queryResults.setError(
          `This SQL Explorer only supports SELECT queries. Operations like CREATE, INSERT, DROP, ALTER, and UPDATE are not supported.`
        );
        toast.error("Only SELECT queries are supported");
        onTabChange("results");
        return;
      }

      // Check if query is unchanged
      if (queryResults.isQueryUnchanged(query)) {
        toast.info("Query is unchanged. Showing previous results.");
        onTabChange("results");
        return;
      }

      // Start execution
      const startTime = queryResults.startExecution();

      try {
        // Validate column names and table names before executing query
        validateColumnNames(query);
        
        // Execute the SQL query using AlaSQL
        const result = alasql(query);

        // Process the result
        const execTime = queryResults.handleSuccess(result, query, startTime);

        // Add to query history
        const timestamp = new Date().toLocaleString();
        const historyItem = {
          query: query,
          timestamp,
          executionTime: execTime,
          saved: savedQueries.some((sq) => sq.query === query),
        };
        updateHistory(historyItem);

        // Show success toast
        toast.success(`Query executed successfully in ${execTime.toFixed(3)}ms`);
        
        // Switch to results tab after execution
        onTabChange("results");
      } catch (err) {
        // Handle error
        queryResults.handleError(err, query);

        // Still switch to results tab to show the error
        onTabChange("results");
      } finally {
        queryResults.completeExecution();
      }
    },
    [onTabChange, queryResults, updateHistory, validateColumnNames]
  );

  return {
    results: queryResults.results,
    isLoading: queryResults.isLoading,
    executionTime: queryResults.executionTime,
    error: queryResults.error,
    executeQuery,
  };
};

export default useQueryExecution;
