import React from "react";
import { mockQueries } from "../../data/mockQueries";
import "./styles.css";
import { FaTrash } from "react-icons/fa";
import useSavedQueriesComponent from "../../hooks/useSavedQueriesComponent";

const SavedQueries = ({
  onSelectQuery,
  onDeleteSavedQuery: parentDeleteHandler,
}) => {
  // Use our custom hook for saved queries management
  const { savedQueries, handleDeleteQuery } = useSavedQueriesComponent(
    mockQueries,
    parentDeleteHandler
  );

  const handleQuerySelect = (query) => {
    onSelectQuery(query, true); // Pass true to indicate this is from saved queries
  };

  return (
    <div className="saved-queries">
      {savedQueries.length === 0 ? (
        <div className="no-saved-queries">No saved queries yet</div>
      ) : (
        <div className="saved-list">
          {savedQueries.map((item, index) => (
            <div
              key={item.id || index}
              className={`saved-item ${item.isPredefined ? "predefined" : ""}`}
            >
              <div
                className="saved-query"
                onClick={() => handleQuerySelect(item.query)}
              >
                <div className="query-name">{item.name}</div>
                {!item.isPredefined && (
                  <div className="query-timestamp">{item.timestamp}</div>
                )}
                <div className="query-text-container">
                  <pre className="query-text">{item.query}</pre>
                </div>
              </div>
              <div className="query-actions">
                {item.isPredefined && (
                  <span className="predefined-badge">Example</span>
                )}
                {!item.isPredefined && (
                  <button
                    className="delete-saved-btn"
                    onClick={() => handleDeleteQuery(index)}
                    title="Delete saved query"
                  >
                    <FaTrash style={{ marginRight: "5px", fontSize: "10px" }} />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedQueries;
