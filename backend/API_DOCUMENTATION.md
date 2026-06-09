# Enterprise Cafe Management System - Backend API

## Overview
Node.js Express backend for the Enterprise Cafe Management System providing REST API endpoints for authentication, user management, cafe operations, and more.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, CORS

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── database.js   # MongoDB connection
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Cafe.js
│   │   └── ActivityLog.js
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── roleController.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── cafeRoutes.js
│   │   └── roleRoutes.js
│   ├── middlewares/      # Custom middleware
│   │   └── auth.js       # JWT & RBAC middleware
│   ├── utils/            # Utility functions
│   │   └── jwt.js        # JWT helpers
│   ├── seeds/            # Database seeders
│   │   └── seedRoles.js  # Initial roles
│   └── index.js          # Main application
├── .env                  # Environment variables
└── package.json

```

## Installation & Setup

### 1. Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cafe_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Application
APP_NAME=Enterprise Cafe Management System
APP_VERSION=1.0.0
```

### 4. Seed Initial Roles
```bash
npm run seed
```

### 5. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```
Response: `{ "message": "API is running", "timestamp": "..." }`

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword",
  "role_name": "Waiter",
  "cafe_id": "cafe_mongodb_id"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Waiter"
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

### Users

#### Get All Users (Admin/Manager)
```
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID
```
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User (Admin/Manager)
```
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "username": "newusername",
  "phone": "+9876543210",
  "is_active": true
}
```

#### Delete User (Admin)
```
DELETE /api/users/:id
Authorization: Bearer <token>
```

#### Change Password
```
PUT /api/users/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "currentpassword",
  "newPassword": "newpassword"
}
```

### Roles

#### Get All Roles
```
GET /api/roles
Authorization: Bearer <token>
```

#### Get Role by ID
```
GET /api/roles/:id
Authorization: Bearer <token>
```

#### Get Role by Name
```
GET /api/roles/name/:name
Authorization: Bearer <token>
```

### Cafes

#### Get All Cafes (Admin)
```
GET /api/cafes
Authorization: Bearer <token>
```

#### Create Cafe (Admin)
```
POST /api/cafes
Authorization: Bearer <token>
Content-Type: application/json

{
  "cafe_name": "Downtown Coffee",
  "location": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA"
  },
  "contact": {
    "phone": "+1234567890",
    "email": "downtown@coffee.com",
    "website": "www.downtowncoffee.com"
  },
  "opening_hours": {
    "open_time": "06:00",
    "close_time": "22:00"
  }
}
```

#### Get Cafe by ID
```
GET /api/cafes/:id
Authorization: Bearer <token>
```

#### Update Cafe (Admin)
```
PUT /api/cafes/:id
Authorization: Bearer <token>
Content-Type: application/json
```

## User Roles & Permissions

### 1. Admin
- Full system access
- Manage users, cafes, menu
- View all reports
- Manage inventory and expenses

### 2. Manager
- Manage cafe operations
- View operational reports
- Manage menu, inventory, expenses
- Cannot manage other users

### 3. Cashier
- View menu
- Create and process orders
- Process payments

### 4. Waiter
- View menu
- Create orders
- Cannot process payments

### 5. Kitchen Staff
- View orders
- Update order status
- Limited access

### 6. Accountant
- View financial reports
- View expenses
- Export reports
- Read-only access

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require an `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days (configurable in `.env`).

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": { ... } // Only in development
}
```

### Common Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Debugging
Enable detailed logging by setting `NODE_ENV=development` in `.env`.

### API Testing
Use Postman or similar tools to test endpoints. Import the provided Postman collection (if available).

## Next Steps

- Implement Phase 2: Menu Management System
- Add menu item CRUD operations
- Implement category management
- Add image upload functionality

## Contributing

Follow these guidelines:
1. Create feature branches from `main`
2. Write clear commit messages
3. Test before pushing
4. Create pull requests with descriptions

## License

ISC
