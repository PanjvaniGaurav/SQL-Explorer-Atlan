import { useEffect } from "react";

/**
 * Custom hook for handling localStorage synchronization between components
 * @param {string} key - The localStorage key to listen for changes
 * @param {Function} onStorageChange - Callback function to run when storage changes
 */
const useLocalStorageSync = (key, onStorageChange) => {
  // Set up listener for storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        onStorageChange();
      }
    };

    // Add event listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, onStorageChange]);

  // Function to trigger a storage event manually for the same window
  const notifyStorageChange = (newValue) => {
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(newValue));

    // Dispatch a storage event to notify components in the same window
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: key,
        newValue: JSON.stringify(newValue),
      })
    );
  };

  return { notifyStorageChange };
};

export default useLocalStorageSync;
