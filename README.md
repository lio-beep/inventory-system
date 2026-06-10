# Inventory System

A Product Inventory System built with React, Ant Design, Express.js, and MSSQL.

## Features
- JWT Authentication (Login/Logout)
- Product CRUD (Create, Read, Update, Delete)
- Dashboard with statistics
- Inventory Reports with low stock alerts

## Tech Stack
- **Frontend:** ReactJS, Ant Design, Axios, React Router
- **Backend:** ExpressJS, Node.js
- **Database:** Microsoft SQL Server (MSSQL)
- **Auth:** JWT (JSON Web Token)

## Prerequisites
- Node.js v18+
- SQL Server Express
- Git

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/lio-beep/inventory-system.git
cd inventory-system
```

### 2. Setup the Database
- Open SSMS and connect to `localhost\SQLEXPRESS`
- Run the following SQL:
```sql
CREATE DATABASE InventoryDB;

USE InventoryDB;

CREATE TABLE Users (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Username NVARCHAR(50) NOT NULL UNIQUE,
  Password NVARCHAR(255) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Categories (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL UNIQUE,
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
JWT_SECRET=inventorysecretkey123
DB_SERVER=localhost\SQLEXPRESS
DB_PORT=1433
DB_NAME=InventoryDB
DB_USER=sa
DB_PASSWORD=YourPasswordHere
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

### 5. Login Credentials
- **Username:** admin
- **Password:** admin123

## Challenges Encountered
- Configuring MSSQL connection with SSL certificate trust issues — resolved by setting `trustServerCertificate: true`
- SQL Server was running on a non-default port — resolved by querying the error log to find the correct port
- React Router v6 requires `<Outlet />` for nested routes instead of the old `<Switch>` approach

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/products | Get all products |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/dashboard | Get dashboard stats |
| GET | /api/reports | Get inventory report |