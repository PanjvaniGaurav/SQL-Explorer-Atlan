# Quartz SQL Explorer

A modern, browser-based SQL query tool for writing, executing, and exploring data with built-in visualization capabilities.

![Quartz SQL Explorer Interface](https://github.com/user-attachments/assets/50647288-ce72-44a7-b9f3-10f18f21f074)

## ✨ Features

- **Interactive SQL Editor**: Professional code editor with syntax highlighting and autocompletion
- **Real Query Execution**: Execute SQL queries against sample data with AlaSQL integration
- **Responsive Results Table**: View query results in a searchable, sortable table with adjustable column widths
- **Query History**: Access your last 15 executed queries for quick reference
- **Saved Queries**: Store frequently used queries with predefined examples and user-saved queries
- **Database Schema Viewer**: Explore table structure, column types, and relationships with visual indicators for primary/foreign keys
- **Export Capability**: Download query results as CSV files with a single click
- **Responsive Design**: Fully optimized for all device sizes from desktop to mobile
- **Local Storage Persistence**: All your queries and preferences are saved between sessions

## 🛠️ Built With

- **React** (v19.0.0) - Modern UI library for building the interface
- **Vite** (v6.2.0) - Fast build tool and development server
- **Monaco Editor** - Professional code editor with SQL syntax support
- **AlaSQL** - JavaScript SQL database for in-browser query execution
- **React CSV** - For exporting results to CSV format

## ⚡ Performance Metrics

The application has been highly optimized for performance:

- **Performance Score**: 94/100
- **First Contentful Paint**: 0.5s
- **Largest Contentful Paint**: 1.6s
- **Total Blocking Time**: 60ms
- **Cumulative Layout Shift**: 0.01
- **Speed Index**: 1.0s

## 🔍 Application Overview

The SQL Explorer features a clean, intuitive interface divided into two main sections:

1. **Left Section (Workspace)**:
   - SQL query editor with syntax highlighting
   - Run button to execute queries
   - Save button to store queries for future use

2. **Right Section (Results)**:
   - Tab-based navigation between Results, History, Saved, and Tables
   - Results table with adjustable column widths and CSV export
   - Query history showing previous executions
   - Saved queries section with examples and user-saved queries
   - Tables section displaying database schema with column details

## 📋 Available Tables

The application comes with sample tables preloaded:
- **Customers**: Customer information with contact details
- **Orders**: Order records with dates and shipping information
- **Products**: Product catalog with inventory status
- **Employees**: Employee directory
- **OrderDetails**: Line items for each order

## 💻 Getting Started

### Prerequisites
- Node.js (v16.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
git clone https://github.com/PanjvaniGaurav/SQL-Explorer-Atlan

2. Install dependencies
npm install

or
yarn

3. Start the development server
npm run dev

or
yarn dev

4. Build for production
npm run build

or
yarn build

## 🌟 Performance Optimizations

- **Efficient DOM Rendering**: Carefully optimized component rendering cycles
- **Custom Scrollbar Styling**: Consistent scrollbar experience across browsers
- **Responsive Design**: Fluid layouts that adapt to any screen size
- **Custom React Hooks**: Modular, reusable logic for state management
- **Memoization**: Strategic use of React.memo and callback functions
- **Pagination**: Implemented for handling large result sets efficiently

## 📂 Project Structure

The project follows a clean, component-based architecture:

src/
├── components/ # UI components
│ ├── QueryHistory/ # History management
│ ├── ResultsTable/ # Results display
│ ├── SavedQueries/ # Saved queries
│ ├── SchemaViewer/ # Database schema
│ └── SQLEditor/ # Code editor
├── data/ # Mock database and schema
├── hooks/ # Custom React hooks
└── App.jsx # Main application

## 🚀 Using the Application

1. **Write a Query**: Enter your SQL in the editor (e.g., `SELECT * FROM Employees`)
2. **Execute**: Click "Run" or press Ctrl+Enter
3. **View Results**: See query output in the Results tab
4. **Explore History**: Access previous queries in the History tab
5. **Save Queries**: Store important queries for future use
6. **Export Data**: Download results as CSV files

## 📈 Future Improvements

- Dark mode support
- Query visualization with charts
- Visual query builder
- User authentication and cloud storage
- Query performance analysis
- Collaborative features for team environments

---

*This project was created as part of the Atlan Frontend Internship Task 2025.*
