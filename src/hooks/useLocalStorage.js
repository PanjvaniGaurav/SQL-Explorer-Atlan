import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage values
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if no value exists in localStorage
 * @returns {[any, Function]} Value and setter function
 */
const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initialValue
  const getInitialValue = () => {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return initialValue;
      }

      // Special handling for SQL query strings
      if (key === "lastSuccessfulSelectQuery" || key === "currentQuery") {
        try {
          // Try to parse as JSON
          const parsed = JSON.parse(item);

          // If it's a SQL query string with quotes, clean it
          if (
            typeof parsed === "string" &&
            (parsed.startsWith('"') || parsed.startsWith("'"))
          ) {
            return parsed.replace(/^["'](.*)["']$/, "$1");
          }

          return parsed;
        } catch (e) {
          // If not valid JSON, it might be a direct string
          // Remove any potential surrounding quotes that shouldn't be there
          return item.replace(/^["'](.*)["']$/, "$1");
        }
      }

      // Regular JSON parsing for other keys
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getInitialValue);

  // Update localStorage when the state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function like useState setter
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      // Ensure we don't double-encode SQL strings
      if (key === "lastSuccessfulSelectQuery" || key === "currentQuery") {
        if (typeof valueToStore === "string") {
          // Store SQL queries directly as strings, not JSON strings
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // If the key changes, get the new value from localStorage
  useEffect(() => {
    setStoredValue(getInitialValue());
  }, [key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
