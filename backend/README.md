# Goal Setting & Tracking Portal - Backend

Production-ready backend for an employee goal-setting and tracking system.

## Tech Stack
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **Bcryptjs** for password hashing
- **Joi** for request validation
- **CSV-Writer** for report generation

## Project Structure
```
server/
├── config/         # Database configuration
├── controllers/    # Route controllers (logic)
├── middleware/     # Custom middleware (auth, error, validation)
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic / helper services
├── utils/          # Utility functions (CSV export)
├── exports/        # Generated CSV files
├── seed/           # Database seed scripts
├── app.js          # Express app configuration
└── server.js       # Entry point
```

## Setup Instructions

1. **Clone the repository** (if applicable)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. **Seed Database**:
   Run the seed script to create demo users (Admin, Manager, Employee).
   ```bash
   npm run seed
   ```
5. **Run the Server**:
   ```bash
   # For development (with nodemon)
   npm run dev

   # For production
   npm start
   ```

## Demo Users
- **Admin**: `admin@test.com` / `password123`
- **Manager**: `manager@test.com` / `password123`
- **Employee**: `employee@test.com` / `password123`

## API Documentation

### Auth Module
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get token
- `GET /api/v1/auth/me` - Get current user profile (Private)

### Employee Module (Private - Employee Role)
- `GET /api/v1/employee/goals` - Get own goals
- `POST /api/v1/employee/goals` - Create a new goal (Max 8)
- `PUT /api/v1/employee/goals/:id` - Update goal (only if not locked)
- `POST /api/v1/employee/submit-goals` - Submit goal sheet (validates total weightage = 100%)
- `PUT /api/v1/employee/goals/:id/quarterly` - Update achievement and status

### Manager Module (Private - Manager Role)
- `GET /api/v1/manager/team-goals` - View goals of reporting employees
- `PUT /api/v1/manager/goals/:id/approve` - Approve goal (locks the goal)
- `PUT /api/v1/manager/goals/:id/reject` - Reject goal (unlocks the goal)
- `PUT /api/v1/manager/goals/:id` - Inline edit target/weightage
- `POST /api/v1/manager/goals/:id/checkin` - Add manager comment/check-in

### Admin Module (Private - Admin Role)
- `GET /api/v1/admin/employees` - View all employees
- `GET /api/v1/admin/goals` - View all goals (supports pagination, filter, sort)
- `PUT /api/v1/admin/goals/:id/unlock` - Unlock a goal for editing
- `GET /api/v1/admin/audit-logs` - View all data change logs
- `GET /api/v1/admin/export-csv` - Export goals report as CSV

## Progress Calculation Logic
1. **Numeric_Min / Percentage_Min**: `achievement / target`
2. **Numeric_Max / Percentage_Max**: `target / achievement`
3. **Timeline**: `100% if achievement >= target else 0%`
4. **Zero**: `100% if achievement == 0 else 0%`

## Validation Rules
- Max 8 goals per employee.
- Minimum weightage per goal = 10%.
- Total weightage must equal 100% for submission.
- Goals become locked after manager approval.
- Audit logs track changes to locked goals.
