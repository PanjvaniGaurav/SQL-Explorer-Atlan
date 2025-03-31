import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for managing tab state
 * @param {string} defaultTab - The default active tab
 * @param {boolean} persistSelection - Whether to save tab selection to localStorage
 * @returns {Object} Tab state and handlers
 */
const useTabs = (defaultTab = 'results', persistSelection = true) => {
  const [activeTab, setActiveTabState] = useState(defaultTab);
  const [storedTab, setStoredTab] = useLocalStorage('activeTab', defaultTab);
  
  // Initialize active tab from localStorage if persistence is enabled
  useEffect(() => {
    if (persistSelection && storedTab) {
      setActiveTabState(storedTab);
    }
  }, []);
  
  // Update activeTab state and localStorage if needed
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    
    if (persistSelection) {
      setStoredTab(tab);
    }
  };
  
  return {
    activeTab,
    setActiveTab,
  };
};

export default useTabs;