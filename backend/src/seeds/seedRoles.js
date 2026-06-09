const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const roles = [
  {
    role_name: 'Admin',
    description: 'Full system access',
    permissions: [
      'manage_users',
      'manage_cafes',
      'manage_menu',
      'manage_orders',
      'view_reports',
      'manage_inventory',
      'manage_expenses',
    ],
  },
  {
    role_name: 'Manager',
    description: 'Manage cafe operations and view reports',
    permissions: [
      'manage_menu',
      'manage_orders',
      'view_reports',
      'manage_inventory',
      'manage_expenses',
    ],
  },
  {
    role_name: 'Cashier',
    description: 'Handle orders and payments',
    permissions: ['view_menu', 'create_orders', 'process_payments'],
  },
  {
    role_name: 'Waiter',
    description: 'Take orders from customers',
    permissions: ['view_menu', 'create_orders'],
  },
  {
    role_name: 'Kitchen Staff',
    description: 'Prepare orders',
    permissions: ['view_orders', 'update_order_status'],
  },
  {
    role_name: 'Accountant',
    description: 'View financial reports',
    permissions: ['view_reports', 'view_expenses', 'export_reports'],
  },
];

const seedRoles = async () => {
  try {
    await connectDB();

    // Clear existing roles
    await Role.deleteMany({});
    console.log('Existing roles deleted');

    // Insert new roles
    await Role.insertMany(roles);
    console.log('Roles seeded successfully');

    mongoose.connection.close();
  } catch (error) {
    console.error(`Error seeding roles: ${error.message}`);
    process.exit(1);
  }
};

seedRoles();