import React from "react";
import { FaChevronRight, FaChevronDown, FaKey, FaLink } from "react-icons/fa";
import useSchemaViewer from "../../hooks/useSchemaViewer";
import "./styles.css";

const SchemaViewer = ({ schema }) => {
  const { expandedTable, toggleTable } = useSchemaViewer(schema);

  return (
    <div className="schema-viewer">
      <div className="schema-header">
        <h2 className="no-select">Database Schema</h2>
      </div>
      <div className="schema-container">
        {Object.keys(schema).map((tableName) => (
          <div key={tableName} className="table-accordion">
            <div
              className={`table-header ${
                expandedTable === tableName ? "expanded" : ""
              } no-select`}
              onClick={() => toggleTable(tableName)}
            >
              {expandedTable === tableName ? (
                <FaChevronDown className="expand-icon" />
              ) : (
                <FaChevronRight className="expand-icon" />
              )}
              <span className="table-name">{tableName}</span>
              <span className="column-count">
                {schema[tableName].columns.length} columns
              </span>
            </div>
            {expandedTable === tableName && (
              <div className="table-content">
                <table className="columns-table">
                  <thead>
                    <tr>
                      <th className="column-name-header">Column Name</th>
                      <th className="column-type-header">Data Type</th>
                      <th className="column-constraints-header">Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema[tableName].columns.map((column) => (
                      <tr key={column.name} className="column-row">
                        <td className="column-name">
                          {column.isPrimaryKey && (
                            <FaKey
                              className="key-icon primary-key-icon"
                              title="Primary Key"
                            />
                          )}
                          {column.isForeignKey && (
                            <FaLink
                              className="key-icon foreign-key-icon"
                              title="Foreign Key"
                            />
                          )}
                          <span>{column.name}</span>
                        </td>
                        <td className="column-type">
                          {column.type.toUpperCase()}
                        </td>
                        <td className="column-constraints">
                          {column.isPrimaryKey && (
                            <span className="constraint primary-key-constraint">
                              PRIMARY KEY
                            </span>
                          )}
                          {column.isForeignKey && column.references && (
                            <span className="constraint foreign-key-constraint">
                              REFERENCES {column.references.table}(
                              {column.references.column})
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer;
