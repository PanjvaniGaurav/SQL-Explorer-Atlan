import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./styles.css";
import { schema } from "../../data/schema";

const SQLEditor = ({ value, onChange, onExecute, onSaveQuery }) => {
  const editorRef = useRef(null);

  // Function to handle editor mounting
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Register SQL language features for better suggestion triggering
    monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters: [' ', '.', ',', '(', '=', '>', '<'],
      
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        const suggestions = [];
        
        // Add SQL keywords
        const keywordSuggestions = [
          { label: "SELECT", insertText: "SELECT ", documentation: "Retrieve data from a table" },
          { label: "FROM", insertText: "FROM ", documentation: "Specify the table to query" },
          { label: "WHERE", insertText: "WHERE ", documentation: "Filter records" },
          { label: "JOIN", insertText: "JOIN ", documentation: "Combine rows from two or more tables" },
          { label: "LEFT JOIN", insertText: "LEFT JOIN ", documentation: "Return all records from the left table" },
          { label: "INNER JOIN", insertText: "INNER JOIN ", documentation: "Return records with matching values" },
          { label: "GROUP BY", insertText: "GROUP BY ", documentation: "Group rows with the same values" },
          { label: "HAVING", insertText: "HAVING ", documentation: "Filter for grouped records" },
          { label: "ORDER BY", insertText: "ORDER BY ", documentation: "Sort the result" },
          { label: "LIMIT", insertText: "LIMIT ", documentation: "Limit the number of records returned" },
          { label: "ON", insertText: "ON ", documentation: "Specify join condition" },
          { label: "AS", insertText: "AS ", documentation: "Rename a column or table with an alias" },
          { label: "AND", insertText: "AND ", documentation: "Logical AND operator" },
          { label: "OR", insertText: "OR ", documentation: "Logical OR operator" },
          { label: "DESC", insertText: "DESC", documentation: "Sort in descending order" },
          { label: "ASC", insertText: "ASC", documentation: "Sort in ascending order" },
        ];
        
        keywordSuggestions.forEach(keyword => {
          suggestions.push({
            label: keyword.label,
            kind: monaco.languages.CompletionItemKind.Keyword,
            documentation: keyword.documentation,
            insertText: keyword.insertText,
            range: range
          });
        });
        
        // Add SQL functions
        const functionSuggestions = [
          { label: "COUNT", insertText: "COUNT", documentation: "Count the number of rows" },
          { label: "SUM", insertText: "SUM", documentation: "Calculate the sum of values" },
          { label: "AVG", insertText: "AVG", documentation: "Calculate the average of values" },
          { label: "MIN", insertText: "MIN", documentation: "Find the minimum value" },
          { label: "MAX", insertText: "MAX", documentation: "Find the maximum value" },
          { label: "COUNT(DISTINCT", insertText: "COUNT(DISTINCT ", documentation: "Count unique values" },
          { label: "ROUND", insertText: "ROUND", documentation: "Round numeric values" },
          { label: "CONCAT", insertText: "CONCAT", documentation: "Concatenate strings" },
        ];
        
        functionSuggestions.forEach(func => {
          suggestions.push({
            label: func.label,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: func.documentation,
            insertText: func.insertText,
            range: range
          });
        });
        
        // Check if we're after FROM or JOIN to suggest tables
        const isAfterFromOrJoin = /FROM\s+$|JOIN\s+$/i.test(textUntilPosition);
        
        // Check if after a period (table.column)
        const isAfterPeriod = /\.$/i.test(textUntilPosition);
        const tableMatch = textUntilPosition.match(/(\w+)\s*\.$/);
        const tablePrefix = tableMatch ? tableMatch[1] : null;
        
        // Add table suggestions
        if (isAfterFromOrJoin || !isAfterPeriod) {
          Object.keys(schema).forEach(tableName => {
            suggestions.push({
              label: tableName,
              kind: monaco.languages.CompletionItemKind.Class,
              detail: `Table (${schema[tableName].columns.length} columns)`,
              documentation: `Table with ${schema[tableName].columns.length} columns`,
              insertText: tableName,
              range: range
            });
          });
        }
        
        // Add column suggestions for a specific table after period
        if (isAfterPeriod && tablePrefix) {
          const table = Object.keys(schema).find(
            t => t.toLowerCase() === tablePrefix.toLowerCase()
          );
          
          if (table && schema[table]) {
            schema[table].columns.forEach(column => {
              suggestions.push({
                label: column.name,
                kind: monaco.languages.CompletionItemKind.Field,
                detail: `Column (${column.type})`,
                documentation: column.description || '',
                insertText: column.name,
                range: range
              });
            });
          }
        }
        
        // Add all columns as standalone suggestions when not after a period
        if (!isAfterPeriod) {
          Object.keys(schema).forEach(tableName => {
            schema[tableName].columns.forEach(column => {
              suggestions.push({
                label: column.name,
                kind: monaco.languages.CompletionItemKind.Field,
                detail: `Column from ${tableName} (${column.type})`,
                documentation: column.description || '',
                insertText: column.name,
                range: range
              });
            });
          });
        }
        
        return { suggestions };
      }
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-label no-select">SQL Query</div>
        <div className="editor-info">
          <span className="editor-hint no-select">
            Enter your SQL query and click Run
          </span>
        </div>
        <div className="editor-actions">
          <button className="execute-button" onClick={onExecute}>
            <span className="button-icon">▶</span>
            Run
          </button>
        </div>
      </div>
      <Editor
        height="350px"
        language="sql"
        theme="vs-light"
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          lineNumbers: "on",
          scrollbar: {
            vertical: "auto",
            horizontal: "auto",
          },
          padding: { top: 10 },
          disableLayerHinting: true,
          readOnly: false,
          renderValidationDecorations: "on",
          renderWhitespace: "none",
          tabCompletion: "on",
          useTabStops: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          },
          acceptSuggestionOnEnter: "on",
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            showKeywords: true,
            showFields: true,
            showClasses: true,
            showFunctions: true
          }
        }}
        className="code-editor-no-ipad-keyboard"
      />
    </div>
  );
};

export default SQLEditor;
