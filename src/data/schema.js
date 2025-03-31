export const schema = {
  Customers: {
    columns: [
      { name: 'CustomerID', type: 'string', isPrimaryKey: true, description: 'Unique identifier for customer' },
      { name: 'CompanyName', type: 'string', isPrimaryKey: false, description: 'Name of the customer company' },
      { name: 'ContactName', type: 'string', isPrimaryKey: false, description: 'Name of the contact person' },
      { name: 'Country', type: 'string', isPrimaryKey: false, description: 'Country where the customer is located' },
      { name: 'Phone', type: 'string', isPrimaryKey: false, description: 'Phone number of the customer' }
    ]
  },
  Orders: {
    columns: [
      { name: 'OrderID', type: 'string', isPrimaryKey: true, description: 'Unique identifier for order' },
      { name: 'CustomerID', type: 'string', isPrimaryKey: false, isForeignKey: true, references: { table: 'Customers', column: 'CustomerID' }, description: 'Reference to customer who placed the order' },
      { name: 'OrderDate', type: 'date', isPrimaryKey: false, description: 'Date when the order was placed' },
      { name: 'ShipCity', type: 'string', isPrimaryKey: false, description: 'City where the order was shipped' },
      { name: 'EmployeeID', type: 'integer', isPrimaryKey: false, isForeignKey: true, references: { table: 'Employees', column: 'EmployeeID' }, description: 'Reference to employee who processed the order' }
    ]
  },
  Products: {
    columns: [
      { name: 'ProductID', type: 'integer', isPrimaryKey: true, description: 'Unique identifier for product' },
      { name: 'ProductName', type: 'string', isPrimaryKey: false, description: 'Name of the product' },
      { name: 'UnitsInStock', type: 'integer', isPrimaryKey: false, description: 'Number of units in stock' },
      { name: 'ReorderLevel', type: 'integer', isPrimaryKey: false, description: 'Level at which product should be reordered' },
      { name: 'Discontinued', type: 'boolean', isPrimaryKey: false, description: 'Whether the product is discontinued' }
    ]
  },
  Employees: {
    columns: [
      { name: 'EmployeeID', type: 'integer', isPrimaryKey: true, description: 'Unique identifier for employee' },
      { name: 'FirstName', type: 'string', isPrimaryKey: false, description: 'First name of the employee' },
      { name: 'LastName', type: 'string', isPrimaryKey: false, description: 'Last name of the employee' }
    ]
  },
  OrderDetails: {
    columns: [
      { name: 'OrderID', type: 'string', isPrimaryKey: true, isForeignKey: true, references: { table: 'Orders', column: 'OrderID' }, description: 'Part of composite key, reference to order' },
      { name: 'ProductID', type: 'integer', isPrimaryKey: true, isForeignKey: true, references: { table: 'Products', column: 'ProductID' }, description: 'Part of composite key, reference to product' },
      { name: 'Quantity', type: 'integer', isPrimaryKey: false, description: 'Quantity of product ordered' },
      { name: 'UnitPrice', type: 'decimal', isPrimaryKey: false, description: 'Price per unit' }
    ]
  }
};

export default schema;
