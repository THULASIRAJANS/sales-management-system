# Sales Management System

## Overview  
Full‑stack Sales Management System dashboard to explore and analyze sales transactions with a modern UI.  
Provides searchable, filterable, and sortable sales data with summary statistics for units, revenue, and discounts.  
Implements server‑side pagination and dynamic queries so the app stays fast even with large datasets.  

## Tech Stack  
- **Frontend**: React, modern CSS (flexbox, gradients, responsive components)  
- **Backend**: Node.js, Express  
- **Database**: MySQL  
- **Other**: Axios (API calls), dotenv (config), concurrently (local dev)  

## Search Implementation Summary  
- Global search input on the dashboard for customer name, phone number, or customer ID.  
- Search text is sent as a `search` query parameter to the backend, which applies SQL `LIKE` conditions across multiple columns.  
- Search works together with filters, sorting, and pagination so users can refine results without page reloads.  

## Filter Implementation Summary  
- Multi-select filters: Customer Region, Gender, Age Range, Product Category, Tags, Payment Method.  
- Date filter supports quick options (today, yesterday, last 7 days, last 30 days, this month, last month) plus a custom date using a calendar picker.  
- Backend uses a QueryBuilder utility to build dynamic `WHERE` clauses (e.g., `IN` for multi-selects, `BETWEEN`/`>=` for age ranges, `DATE()`/`MONTH()`/`YEAR()` for dates).  

## Sorting Implementation Summary  
- Sort dropdown with options like Customer Name (A–Z/Z–A), Amount (Low–High/High–Low), and Date (Oldest/Newest).  
- Selected sort key is passed as a `sortBy` query parameter and translated into an `ORDER BY` clause in SQL.  
- Sorting is applied after filters and search but before pagination to ensure consistent results.  

## Pagination Implementation Summary  
- Server‑side pagination using `page` and `limit` query parameters.  
- Backend calculates `OFFSET = (page - 1) * limit` and returns both the current page of rows and the total count.  
- Frontend renders a modern pagination bar with Previous/Next buttons, page numbers, ellipsis for large page sets, and a "showing X–Y of Z entries" label.  

## Setup Instructions  

### 1. Clone the repository  
git clone https://github.com/<your-username>/sales-management-system.git
cd sales-management-system

### 2. Install all dependencies (root, frontend, backend)  
npm run install-all

### 3. Configure backend environment  
Create an `.env` file inside the `api` folder:  
DB_HOST=your-mysql-host
DB_PORT=your-mysql-port
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=RSMS
PORT=3001

### 4. Run the app locally (frontend + backend together)  
npm run dev


## API Endpoints
- `GET /api/sales` - Get paginated sales data with optional filters, search, and sorting
- `GET /api/stats` - Get summary statistics (total units sold, total amount, total discount)

## Features
✅ **Search** - Find customers by name, phone, or ID  
✅ **Filters** - Multi-select dropdowns for region, gender, age, category, tags, payment method, date  
✅ **Sorting** - Sort by name, amount, or date in ascending/descending order  
✅ **Pagination** - Server-side pagination with dynamic page controls  
✅ **Statistics** - Real-time dashboard cards showing key metrics  
✅ **Responsive UI** - Modern gradient design with smooth animations  

## Technologies Used
| Category | Technologies |
|----------|-------------|
| Frontend | React, CSS3 (Flexbox, Grid, Animations) |
| Backend | Node.js, Express.js |
| Database | MySQL with mysql2 driver |
| Dev Tools | Concurrently, dotenv, Axios |
| Deployment | Render (Backend + Frontend) |


