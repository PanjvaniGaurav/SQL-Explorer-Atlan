import React from "react";
import "./styles.css";
import { FaTrash } from "react-icons/fa";
import useQueryHistoryComponent from "../../hooks/useQueryHistoryComponent";

const QueryHistory = ({ history, onSelectQuery, onDeleteQuery }) => {
  // Use our custom hook for query history management
  const { handleQuerySelect, handleDeleteQuery } = useQueryHistoryComponent(
    history,
    onSelectQuery,
    onDeleteQuery
  );

  return (
    <div className="query-history">
      {history.length === 0 ? (
        <div className="no-history">No queries executed yet</div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div
                className="history-query"
                onClick={() => handleQuerySelect(item.query)}
              >
                <div className="query-text-container">
                  <pre className="query-text">{item.query}</pre>
                </div>
                <div className="query-meta">
                  <span className="query-time">{item.timestamp}</span>
                  {item.executionTime && (
                    <span className="query-execution-time">
                      {item.executionTime.toFixed(3)}ms
                    </span>
                  )}
                </div>
              </div>
              <div className="query-actions">
                <button
                  className="delete-history-btn"
                  onClick={() => handleDeleteQuery(index)}
                  title="Delete from history"
                >
                  <FaTrash style={{ marginRight: "5px", fontSize: "10px" }} />{" "}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueryHistory;
