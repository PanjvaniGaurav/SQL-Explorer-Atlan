import { toast } from "react-toastify";

/**
 * Custom hook for managing toast notifications with consistent styling and messages
 * @returns {Object} Object containing functions for different toast notifications
 */
const useToastNotifications = () => {
  // Query execution notifications
  const notifyQueryExecuted = (executionTime) => {
    toast.success(
      `Query executed successfully in ${executionTime.toFixed(3)}ms`
    );
  };

  const notifyQueryError = (errorMessage) => {
    toast.error(`Query failed: ${errorMessage}`);
  };

  const notifySyntaxError = (errorMessage, suppressToast = false) => {
    // Extract the specific syntax error from the message
    let userFriendlyMessage = errorMessage;
    
    // Check for common parse errors
    if (errorMessage.includes("Parse error") || errorMessage.includes("Expecting")) {
      // Create a more user-friendly message
      if (errorMessage.includes("SEMICOLON")) {
        userFriendlyMessage = "Syntax error: Missing or misplaced semicolon in your query";
      } else if (errorMessage.includes("FROM")) {
        userFriendlyMessage = "Syntax error: Issue with the FROM clause in your query";
      } else if (errorMessage.includes("Table") && errorMessage.includes("not found")) {
        userFriendlyMessage = "Error: Table not found. Please check the table name in your query.";
      } else if (errorMessage.includes("Cannot find table")) {
        userFriendlyMessage = "Error: Table not found. Please check the table name in your query.";
      } else {
        // Generic parse error handling
        userFriendlyMessage = "Syntax error in your SQL query. Please check your syntax.";
      }
    } else if (errorMessage.includes("no such table")) {
      userFriendlyMessage = "Error: The specified table does not exist. Please check the table name.";
    }
    
    // Only show toast if not suppressed
    if (!suppressToast) {
      toast.error(`SQL syntax error: ${userFriendlyMessage}`);
    }
    
    return userFriendlyMessage;
  };

  const notifyQueryUnchanged = () => {
    toast.info("Query is unchanged. Showing previous results.");
  };

  // Saved query notifications
  const notifyQuerySaved = () => {
    toast.success("Query saved successfully");
  };

  const notifyQueryAlreadySaved = () => {
    toast.info("This query is already saved");
  };

  const notifyQueryDeleted = () => {
    toast.error("Saved query deleted");
  };

  const notifyPredefinedDeleteError = () => {
    toast.info("Predefined example queries cannot be deleted");
  };

  const notifySaveError = (error) => {
    toast.error(`Failed to save query: ${error.message}`);
  };

  const notifyDeleteError = (error) => {
    toast.error(`Failed to delete query: ${error.message}`);
  };

  // History notifications
  const notifyHistoryQueryLoaded = () => {
    toast.info("Query loaded from history");
  };

  const notifySavedQueryLoaded = () => {
    toast.info("Query loaded from saved queries");
  };

  return {
    notifyQueryExecuted,
    notifyQueryError,
    notifySyntaxError,
    notifyQueryUnchanged,
    notifyQuerySaved,
    notifyQueryAlreadySaved,
    notifyQueryDeleted,
    notifyPredefinedDeleteError,
    notifySaveError,
    notifyDeleteError,
    notifyHistoryQueryLoaded,
    notifySavedQueryLoaded,
  };
};

export default useToastNotifications;
