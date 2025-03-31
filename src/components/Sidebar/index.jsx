import React, { useState } from 'react';
import './styles.css';

const QueryItem = ({ query, isActive, onClick }) => {
  return (
    <div 
      className={`query-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="query-name">{query.name}</div>
      <div className="query-description">{query.description}</div>
    </div>
  );
};

const SavedQueryItem = ({ query, onLoad, onDelete }) => {
  return (
    <div className="saved-query-item">
      <div className="saved-query-info" onClick={() => onLoad(query.query)}>
        <div className="saved-query-name">{query.name}</div>
        <div className="saved-query-timestamp">{query.timestamp}</div>
      </div>
      <button 
        className="delete-query-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onDelete(query.id);
        }}
        title="Delete query"
      >
        Delete
      </button>
    </div>
  );
};

const TableItem = ({ tableName, schema, expandedTable, onToggleTable }) => {
  const isExpanded = expandedTable === tableName;
  
  return (
    <div className="table-item">
      <div 
        className={`table-header ${isExpanded ? 'expanded' : ''}`}
        onClick={() => onToggleTable(tableName)}
      >
        <div className="table-name">{tableName}</div>
        <div className="expand-icon">{isExpanded ? '−' : '+'}</div>
      </div>
      
      {isExpanded && (
        <div className="table-columns">
          {schema[tableName].columns.map(column => (
            <div key={column.name} className="column-item">
              <div className="column-name">
                {column.name}
                {column.isPrimaryKey && <span className="key-badge primary">PK</span>}
                {column.isForeignKey && <span className="key-badge foreign">FK</span>}
              </div>
              <div className="column-type">{column.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ 
  queries, 
  activeQueryId, 
  onQuerySelect, 
  savedQueries = [], 
  onLoadSavedQuery = () => {}, 
  onDeleteSavedQuery = () => {},
  schema = {}
}) => {
  const [activeTab, setActiveTab] = useState('queries');
  const [expandedTable, setExpandedTable] = useState(null);

  const handleToggleTable = (tableName) => {
    if (expandedTable === tableName) {
      setExpandedTable(null);
    } else {
      setExpandedTable(tableName);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <div 
          className={`tab ${activeTab === 'queries' ? 'active' : ''}`}
          onClick={() => setActiveTab('queries')}
        >
          Queries
        </div>
        <div 
          className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          Tables
        </div>
        <div 
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved
        </div>
      </div>

      {activeTab === 'queries' && (
        <div className="tab-content">
          <h2 className="sidebar-header">Predefined Queries</h2>
          <div className="query-list">
            {queries.map(query => (
              <QueryItem
                key={query.id}
                query={query}
                isActive={query.id === activeQueryId}
                onClick={() => onQuerySelect(query.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tables' && schema && (
        <div className="tab-content">
          <h2 className="sidebar-header">Database Tables</h2>
          <div className="tables-list">
            {Object.keys(schema).map(tableName => (
              <TableItem 
                key={tableName}
                tableName={tableName}
                schema={schema}
                expandedTable={expandedTable}
                onToggleTable={handleToggleTable}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="tab-content">
          <h2 className="sidebar-header">Saved Queries</h2>
          {savedQueries.length === 0 ? (
            <div className="no-saved-queries">No saved queries yet</div>
          ) : (
            <div className="saved-query-list">
              {savedQueries.map(query => (
                <SavedQueryItem
                  key={query.id}
                  query={query}
                  onLoad={onLoadSavedQuery}
                  onDelete={onDeleteSavedQuery}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
