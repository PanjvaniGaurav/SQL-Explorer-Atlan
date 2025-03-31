import { useEffect, useRef } from "react";
import alasql from "alasql";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SQLEditor from "./components/SQLEditor";
import ResultsTable from "./components/ResultsTable";
import QueryHistory from "./components/QueryHistory";
import SavedQueries from "./components/SavedQueries";
import SchemaViewer from "./components/SchemaViewer";

// Data
import { mockQueries } from "./data/mockQueries";
import { database } from "./data/database";
import { schema } from "./data/schema";

// Hooks
import useAppState from "./hooks/useAppState";

// Icons and styles
import { FaClock, FaTable } from "react-icons/fa";
import "./App.css";

function App() {
  // Track if this is the initial render
  const isInitialMount = useRef(true);

  // Use our unified app state hook
  const {
    // State
    activeTab,
    currentQuery,
    searchTerm,
    results,
    isLoading,
    executionTime,
    error,
    initialQueryExecuted,
    queryHistory,
    savedQueries,

    // Actions
    setActiveTab,
    setInitialQueryExecuted,
    handleQueryChange,
    handleQueryExecute,
    handleSelectFromHistory,
    handleSaveQuery,
    handleDeleteSavedQuery,
    handleSearch,
    executeQuery,
    executeQueryWithCallback,
    handleDeleteFromHistory,
  } = useAppState(mockQueries, mockQueries[0].query);

  // Initialize AlaSQL with our database tables
  useEffect(() => {
    // Create tables and insert data
    Object.keys(database).forEach((tableName) => {
      alasql(`DROP TABLE IF EXISTS ${tableName}`);
      alasql(`CREATE TABLE ${tableName}`);
      alasql.tables[tableName].data = database[tableName];
    });
  }, []);

  // Handle empty editor ONLY on page refresh/initial load
  useEffect(() => {
    // Only run this effect on the first render (page load/refresh)
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // Check if editor is empty on initial load
      const isEmptyEditor = !currentQuery || currentQuery.trim() === "";

      if (isEmptyEditor) {
        // Try to recover last successful query for the editor only
        const lastSuccessfulQuery = localStorage.getItem(
          "lastSuccessfulSelectQuery"
        );

        if (lastSuccessfulQuery) {
          try {
            // The value might be stored with quotes - need to parse JSON or strip quotes
            const parsedQuery = JSON.parse(lastSuccessfulQuery);
            // Just update the editor without executing
            handleQueryChange(parsedQuery);
          } catch (e) {
            // If JSON parsing fails, try to use the string directly
            const cleanedQuery = lastSuccessfulQuery.replace(
              /^["'](.*)["']$/,
              "$1"
            );
            // Just update the editor without executing
            handleQueryChange(cleanedQuery);
          }
        }
      }
    }
  }, [currentQuery, handleQueryChange]);

  // Execute initial query once
  useEffect(() => {
    if (!initialQueryExecuted) {
      // If we have a current query, execute it
      if (currentQuery && currentQuery.trim() !== "") {
        executeQuery(currentQuery, savedQueries);
      } else {
        // Otherwise use the first mock query
        executeQuery(mockQueries[0].query, savedQueries);
      }
      setInitialQueryExecuted(true);
    }
  }, [
    initialQueryExecuted,
    currentQuery,
    executeQuery,
    setInitialQueryExecuted,
    savedQueries,
  ]);

  // Helper function to format SQL errors for better readability
  const formatErrorMessage = (errorMsg) => {
    if (!errorMsg) return "";

    // Handle parse errors with better formatting
    if (errorMsg.includes("Parse error") || errorMsg.includes("Expecting")) {
      // Extract the specific part of the error message
      const errorParts = errorMsg.split(":");
      if (errorParts.length > 1) {
        // Format for syntax errors
        return (
          <div className="formatted-error">
            <div className="error-title">Syntax Error</div>
            <div className="error-message">
              There's a syntax error in your SQL query. Please check:
            </div>
            <ul className="error-details">
              {errorMsg.includes("SEMICOLON") && (
                <li>You may have a misplaced or missing semicolon</li>
              )}
              {errorMsg.includes("FROM") && (
                <li>Check your FROM clause syntax</li>
              )}
              <li>
                Make sure your SQL keywords and clauses are properly formatted
              </li>
            </ul>
          </div>
        );
      }
    }

    // Handle table not found errors with more detailed information
    if (
      (errorMsg.includes("Table") && errorMsg.includes("not found")) ||
      errorMsg.includes("Cannot find table") ||
      errorMsg.includes("no such table")
    ) {
      // Try to extract the table name from the error message
      let tableName = "";
      const tableMatch = errorMsg.match(/Table "([^"]+)"/);
      if (tableMatch && tableMatch[1]) {
        tableName = tableMatch[1];
      }

      return (
        <div className="formatted-error">
          <div className="error-title">Table Error</div>
          <div className="error-message">
            {tableName
              ? `The table "${tableName}" doesn't exist or might be misspelled.`
              : "The table you're trying to query doesn't exist or might be misspelled."}
          </div>
          <ul className="error-details">
            <li>
              Check that the table name is spelled correctly and is
              case-sensitive
            </li>
            <li>
              Available tables: Customers, Orders, Products, Employees,
              OrderDetails
            </li>
            <li>View table schema details in the "Tables" tab</li>
          </ul>
        </div>
      );
    }

    // Default error display
    return errorMsg;
  };

  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <header className="app-header">
        <div className="logo-container">
          <span className="logo-icon no-select">📊</span>
          <span className="app-title no-select">Quartz</span>
        </div>
        <span className="app-title no-select">SQL Explorer</span>
      </header>
      <div className="main-content">
        <div className="workspace">
          <div className="editor-container">
            <div className="sql-explorer-heading no-select">SQL Explorer</div>
            <div className="sql-explorer-description no-select">
              Run queries and explore your data
            </div>
            <SQLEditor
              value={currentQuery}
              onChange={handleQueryChange}
              onExecute={handleQueryExecute}
              onSaveQuery={handleSaveQuery}
            />
            <div className="save-query-button-container">
              <button
                className="save-button"
                onClick={() => handleSaveQuery(currentQuery)}
                title="Save query"
              >
                Save Current Query
              </button>
            </div>
            {executionTime && !error && activeTab === "results" && (
              <div className="new-status-bar">
                <div className="status-message">
                  Query executed successfully
                </div>
                <div className="status-details">
                  <span>
                    <FaClock /> Execution Time: {executionTime.toFixed(3)}ms
                  </span>
                  <span>
                    <FaTable /> Rows Returned: {results.data.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="results-section">
          <div className="tabs-container">
            <div
              className={`tab ${activeTab === "results" ? "active" : ""} no-select`}
              onClick={() => setActiveTab("results")}
            >
              Results
            </div>
            <div
              className={`tab ${activeTab === "history" ? "active" : ""} no-select`}
              onClick={() => setActiveTab("history")}
            >
              History
            </div>
            <div
              className={`tab ${activeTab === "saved" ? "active" : ""} no-select`}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </div>
            <div
              className={`tab ${activeTab === "tables" ? "active" : ""} no-select`}
              onClick={() => setActiveTab("tables")}
            >
              Tables
            </div>
          </div>

          <div className="results-container">
            {activeTab === "results" && (
              <>
                {error && (
                  <div className="execution-error">
                    {formatErrorMessage(error)}
                  </div>
                )}
                <ResultsTable
                  data={results.data}
                  columns={results.columns}
                  isLoading={isLoading}
                  searchTerm={searchTerm}
                  onSearch={handleSearch}
                />
              </>
            )}

            {activeTab === "history" && (
              <QueryHistory
                history={queryHistory}
                onSelectQuery={handleSelectFromHistory}
                onDeleteQuery={handleDeleteFromHistory}
              />
            )}

            {activeTab === "saved" && (
              <SavedQueries
                onSelectQuery={handleSelectFromHistory}
                onDeleteSavedQuery={handleDeleteSavedQuery}
              />
            )}

            {activeTab === "tables" && <SchemaViewer schema={schema} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
