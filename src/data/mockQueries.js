export const mockQueries = [
  // Simple queries
  {
    id: 0,
    name: "Customers by Country",
    description: "List all customers grouped by country",
    query: "SELECT Country, COUNT(*) as CustomerCount FROM Customers GROUP BY Country ORDER BY CustomerCount DESC;"
  },
  {
    id: 1,
    name: "Low Stock Products",
    description: "Find products with stock below reorder level",
    query: "SELECT ProductID, ProductName, UnitsInStock, ReorderLevel FROM Products WHERE UnitsInStock < ReorderLevel AND Discontinued = 0 ORDER BY UnitsInStock ASC;"
  },
  
  // Complex queries
  {
    id: 2,
    name: "Top Selling Products",
    description: "Calculate total sales and quantity ordered for each product",
    query: "SELECT p.ProductID, p.ProductName, SUM(od.Quantity) as TotalQuantity, SUM(od.Quantity * od.UnitPrice) as TotalSales FROM Products p JOIN OrderDetails od ON p.ProductID = od.ProductID GROUP BY p.ProductID, p.ProductName ORDER BY TotalSales DESC LIMIT 10;"
  },
  {
    id: 3,
    name: "Customer Order Analysis",
    description: "Detailed order statistics for each customer",
    query: "SELECT c.CustomerID, c.CompanyName, c.Country, COUNT(DISTINCT o.OrderID) as OrderCount, SUM(od.Quantity * od.UnitPrice) as TotalSpent, AVG(od.Quantity * od.UnitPrice) as AvgOrderValue FROM Customers c JOIN Orders o ON c.CustomerID = o.CustomerID JOIN OrderDetails od ON o.OrderID = od.OrderID GROUP BY c.CustomerID, c.CompanyName, c.Country ORDER BY TotalSpent DESC;"
  },
  {
    id: 4,
    name: "Sales Performance by Region",
    description: "Analyze sales performance across different shipping regions",
    query: "SELECT o.ShipCity, COUNT(DISTINCT o.OrderID) as OrderCount, SUM(od.Quantity) as TotalItemsOrdered, SUM(od.Quantity * od.UnitPrice) as TotalRevenue, AVG(od.UnitPrice) as AvgUnitPrice FROM Orders o JOIN OrderDetails od ON o.OrderID = od.OrderID JOIN Products p ON od.ProductID = p.ProductID GROUP BY o.ShipCity ORDER BY TotalRevenue DESC LIMIT 15;"
  },
  {
    id: 5,
    name: "Employee Sales Summary",
    description: "Basic summary of sales by employee",
    query: "SELECT e.EmployeeID, e.FirstName, e.LastName, COUNT(o.OrderID) as TotalOrders FROM Employees e LEFT JOIN Orders o ON e.EmployeeID = o.EmployeeID GROUP BY e.EmployeeID, e.FirstName, e.LastName ORDER BY TotalOrders DESC;"
  }
]; 