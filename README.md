# Enterprise Cafe Management System

## Overview
A comprehensive cafe management solution designed to streamline operations, optimize profitability, and enhance customer experience. This enterprise-level application integrates POS, inventory management, financial analytics, and customer relationship features.

## Project Structure
```
cafe-management-system/
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── models/           # MongoDB schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middlewares/      # Authentication & RBAC
│   │   ├── utils/            # Helper functions
│   │   ├── seeds/            # Database seeders
│   │   └── index.js          # Entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── API_DOCUMENTATION.md
│
├── mobile-app/              # React Native (Expo) Mobile App
│   ├── src/                  # Source files
│   ├── App.js                # Main app component
│   ├── app.json              # Expo config
│   ├── tailwind.config.js    # Tailwind CSS config
│   └── package.json
│
└── README.md                 # This file
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Security**: bcryptjs, helmet, CORS

### Frontend (Mobile)
- **Framework**: React Native (Expo)
- **Styling**: Tailwind CSS (NativeWind)
- **Platform Support**: iOS & Android

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** with configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cafe_management
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
APP_NAME=Enterprise Cafe Management System
APP_VERSION=1.0.0
```

4. **Seed initial roles:**
```bash
npm run seed
```

5. **Start the server:**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

API runs at: `http://localhost:5000`

### Mobile App Setup

1. **Navigate to mobile-app directory:**
```bash
cd mobile-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start Expo:**
```bash
npx expo start
```

4. **Launch on device/emulator:**
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Press `w` for Web

## API Documentation

See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) for:
- Complete endpoint documentation
- Authentication details
- Request/response examples
- Error handling

### Key Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

**Users:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Cafes:**
- `GET /api/cafes` - Get all cafes
- `POST /api/cafes` - Create cafe
- `GET /api/cafes/:id` - Get cafe details
- `PUT /api/cafes/:id` - Update cafe

**Roles:**
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID

## User Roles

- **Admin** - Full system access
- **Manager** - Operations & reports management
- **Cashier** - Orders & payments
- **Waiter** - Order taking
- **Kitchen Staff** - Order preparation
- **Accountant** - Finance reports

## Development Phases

### Phase 1: Core Infrastructure ✓
- [x] User authentication & role management
- [x] Multi-cafe support
- [x] Database setup
- [x] Basic dashboard structure

### Phase 2: Menu Management (Upcoming)
- [ ] Menu CRUD operations
- [ ] Category management
- [ ] Image upload
- [ ] Variants & add-ons

### Phase 3: Table & Order Management
- [ ] Table management
- [ ] Order workflow
- [ ] Kitchen display system

### Phase 4: Billing & Payment
- [ ] Bill generation
- [ ] Payment integration
- [ ] Discount management

### Phases 5-11: Advanced Features
- Inventory management
- Financial analytics
- Customer CRM
- Delivery management
- Mobile apps
- Security & compliance

## Environment Variables

### Backend (.env)
```env
PORT                    # Server port (default: 5000)
NODE_ENV               # Environment (development/production)
MONGODB_URI            # MongoDB connection string
JWT_SECRET             # JWT secret key
JWT_EXPIRE             # JWT expiration time
APP_NAME               # Application name
APP_VERSION            # Application version
```

## Testing

### API Testing with Postman
- Import Postman collection (coming soon)
- Base URL: `http://localhost:5000`
- Add `Authorization: Bearer <token>` to headers

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"pass123","role_name":"Waiter","cafe_id":"..."}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

## Database Schema

### Users
- Stores user information with role and cafe association
- Password hashing with bcryptjs
- Last login tracking

### Roles
- Predefined roles: Admin, Manager, Cashier, Waiter, Kitchen Staff, Accountant
- Permission system for each role

### Cafes
- Multi-cafe support for enterprise deployments
- Location, contact, and operating hours

### Activity Log
- Audit trail for compliance
- Tracks user actions and changes

## Security Features

- JWT-based authentication
- Password encryption (bcryptjs)
- RBAC (Role-Based Access Control)
- CORS protection
- Helmet security headers
- Activity logging & audit trail

## Error Handling

API returns structured error responses:
```json
{
  "message": "Error description",
  "error": { ... }
}
```

## Performance Optimization

- Database indexing on frequently queried fields
- JWT caching (stateless auth)
- CORS for efficient client requests
- Compression middleware ready

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.

## Next Steps

1. Install backend dependencies and start the dev server
2. Seed the database with initial roles
3. Test authentication endpoints
4. Set up mobile app connection to backend
5. Begin Phase 2: Menu Management implementation
