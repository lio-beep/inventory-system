# Inventory System

Inventory System is a simple web application that allows users to manage products, monitor inventory levels, and generate basic inventory reports through a RESTful API.

## Tech Stack
- **Frontend:** ReactJS, Ant Design, React Router, Axios
- **Backend:** ExpressJS, Node.js
- **Database:** Microsoft SQL Server (MSSQL)
- **Auth:** JWT (JSON Web Token)

## Features
- Login with JWT authentication
- Product CRUD (Create, Read, Update, Delete)
- Search and filter products
- Dashboard with inventory statistics
- Inventory report with low stock alerts

## Requirements
- Node.js v18+
- SQL Server Express
- Git

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/lio-beep/inventory-system.git
cd inventory-system
```

### 2. Setup the Database
- Open SSMS and connect to `localhost\SQLEXPRESS`
- Create the database and tables:

```sql
CREATE DATABASE InventoryDB;

USE InventoryDB;

CREATE TABLE Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Username NVARCHAR(50) NOT NULL UNIQUE,
  Password NVARCHAR(255) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(150) NOT NULL,
  Category NVARCHAR(100) NOT NULL,
  Quantity INT NOT NULL DEFAULT 0,
  UnitPrice DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME DEFAULT GETDATE()
);
```

### 3. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
PORT=5000
JWT_SECRET=your_jwt_secret
DB_SERVER=localhost\SQLEXPRESS
DB_NAME=InventoryDB
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
DB_ENCRYPT=false
DB_TRUST_CERT=true

Seed the admin user:
```bash
node src/seed.js
```

Start the backend:
```bash
node src/index.js
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 5. Login
- **Username:** admin
- **Password:** admin123

## API Endpoints

### Authentication
POST /api/auth/login

### Products
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

### Dashboard
GET /api/dashboard

### Reports
GET /api/reports

## Challenges Encountered
- SQL Server SSL certificate issue — resolved by setting `trustServerCertificate: true`
- SQL Server was running on a non-default port — resolved by querying the error log to find the correct port number
- React Router v6 uses `<Outlet />` for nested routes instead of the old `<Switch>` approach