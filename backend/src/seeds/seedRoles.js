const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Role = require('../models/Role');
const User = require('../models/User');
const Cafe = require('../models/Cafe');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Order = require('../models/Order');
const OrderHistory = require('../models/OrderHistory');

dotenv.config();

const DEMO_PASSWORD = 'Pass123!';
const categoryIds = {
  coffee: new mongoose.Types.ObjectId(),
  tea: new mongoose.Types.ObjectId(),
  bakery: new mongoose.Types.ObjectId(),
};
const tableIds = {
  t1: new mongoose.Types.ObjectId(),
  t2: new mongoose.Types.ObjectId(),
  t3: new mongoose.Types.ObjectId(),
  t4: new mongoose.Types.ObjectId(),
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

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  const cafeId = new mongoose.Types.ObjectId();
  const adminId = new mongoose.Types.ObjectId();
  const waiterId = new mongoose.Types.ObjectId();

  try {
    await connectDB();

    await User.deleteMany({});
    await Cafe.deleteMany({});
    await OrderHistory.deleteMany({});
    await Order.deleteMany({});
    await Table.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Role.deleteMany({});
    console.log('Cleared users, cafes, orders, tables, menu items, categories, and roles');

    const seededRoles = await Role.insertMany(roles);
    const rolesByName = seededRoles.reduce((accumulator, role) => {
      accumulator[role.role_name] = role;
      return accumulator;
    }, {});

    await User.create({
      _id: adminId,
      username: 'admin',
      email: 'admin@flagshipcafe.com',
      phone: '+10000000001',
      password_hash: DEMO_PASSWORD,
      role_id: rolesByName.Admin._id,
      cafe_id: cafeId,
    });

    await Cafe.create({
      _id: cafeId,
      cafe_name: 'Flagship Cafe',
      location: {
        street: '123 Market Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        postal_code: '560001',
        country: 'India',
      },
      contact: {
        phone: '+91 80 4000 1234',
        email: 'hello@flagshipcafe.com',
        website: 'flagshipcafe.com',
      },
      opening_hours: {
        open_time: '07:00',
        close_time: '23:00',
      },
      owner_id: adminId,
    });

    await Category.insertMany([
      {
        _id: categoryIds.coffee,
        cafe_id: cafeId,
        category_name: 'Coffee',
        description: 'Espresso bar favorites and signature brews.',
        display_order: 1,
      },
      {
        _id: categoryIds.tea,
        cafe_id: cafeId,
        category_name: 'Tea',
        description: 'Slow-steeped teas for all-day service.',
        display_order: 2,
      },
      {
        _id: categoryIds.bakery,
        cafe_id: cafeId,
        category_name: 'Bakery',
        description: 'Fresh pastries and cafe pairings.',
        display_order: 3,
      },
    ]);

    const menuItems = await MenuItem.insertMany([
      {
        cafe_id: cafeId,
        category_id: categoryIds.coffee,
        item_name: 'Flat White',
        description: 'Double ristretto with silky steamed milk.',
        base_price: 180,
        prep_time_minutes: 6,
        dietary_tags: ['vegetarian'],
        allergens: ['dairy'],
        is_popular: true,
        rating: 4.8,
        sales_count: 124,
      },
      {
        cafe_id: cafeId,
        category_id: categoryIds.coffee,
        item_name: 'Iced Americano',
        description: 'Chilled espresso over ice with a citrus finish.',
        base_price: 160,
        prep_time_minutes: 4,
        dietary_tags: ['vegan'],
        is_popular: true,
        rating: 4.6,
        sales_count: 96,
      },
      {
        cafe_id: cafeId,
        category_id: categoryIds.tea,
        item_name: 'Masala Chai',
        description: 'House spice blend simmered with Assam tea.',
        base_price: 120,
        prep_time_minutes: 8,
        dietary_tags: ['vegetarian'],
        allergens: ['dairy'],
        rating: 4.7,
        sales_count: 82,
      },
      {
        cafe_id: cafeId,
        category_id: categoryIds.bakery,
        item_name: 'Almond Croissant',
        description: 'Buttery laminated pastry with toasted almond cream.',
        base_price: 140,
        prep_time_minutes: 3,
        dietary_tags: ['vegetarian'],
        allergens: ['gluten', 'nuts', 'dairy'],
        rating: 4.5,
        sales_count: 65,
      },
      {
        cafe_id: cafeId,
        category_id: categoryIds.bakery,
        item_name: 'Banana Walnut Loaf',
        description: 'Moist tea cake served in thick cafe slices.',
        base_price: 110,
        prep_time_minutes: 2,
        dietary_tags: ['vegetarian'],
        allergens: ['gluten', 'nuts'],
        rating: 4.4,
        sales_count: 41,
      },
    ]);

    const menuItemsByName = menuItems.reduce((accumulator, item) => {
      accumulator[item.item_name] = item;
      return accumulator;
    }, {});

    await Table.insertMany([
      {
        _id: tableIds.t1,
        cafe_id: cafeId,
        table_number: 'T1',
        capacity: 2,
        status: 'occupied',
        notes: 'Window corner seating',
      },
      {
        _id: tableIds.t2,
        cafe_id: cafeId,
        table_number: 'T2',
        capacity: 4,
        status: 'reserved',
        notes: 'Reserved for 7:30 PM party',
      },
      {
        _id: tableIds.t3,
        cafe_id: cafeId,
        table_number: 'T3',
        capacity: 4,
        status: 'occupied',
        notes: 'Near pastry display',
      },
      {
        _id: tableIds.t4,
        cafe_id: cafeId,
        table_number: 'T4',
        capacity: 6,
        status: 'empty',
        notes: 'Large group table',
      },
    ]);

    await User.create({
      _id: waiterId,
      username: 'floor.waiter',
      email: 'waiter@flagshipcafe.com',
      phone: '+10000000002',
      password_hash: DEMO_PASSWORD,
      role_id: rolesByName.Waiter._id,
      cafe_id: cafeId,
    });

    const orders = await Order.create([
      {
        cafe_id: cafeId,
        table_id: tableIds.t1,
        order_number: 'ORD-DEMO-0001',
        order_type: 'dine-in',
        waiter_id: waiterId,
        status: 'preparing',
        priority: 'normal',
        items: [
          {
            menu_item_id: menuItemsByName['Flat White']._id,
            item_name: 'Flat White',
            quantity: 2,
            unit_price: menuItemsByName['Flat White'].base_price,
            item_status: 'preparing',
          },
          {
            menu_item_id: menuItemsByName['Almond Croissant']._id,
            item_name: 'Almond Croissant',
            quantity: 1,
            unit_price: menuItemsByName['Almond Croissant'].base_price,
            item_status: 'pending',
          },
        ],
        special_notes: 'Serve coffee extra hot.',
      },
      {
        cafe_id: cafeId,
        table_id: tableIds.t3,
        order_number: 'ORD-DEMO-0002',
        order_type: 'dine-in',
        waiter_id: waiterId,
        status: 'ready',
        priority: 'vip',
        is_priority: true,
        items: [
          {
            menu_item_id: menuItemsByName['Masala Chai']._id,
            item_name: 'Masala Chai',
            quantity: 2,
            unit_price: menuItemsByName['Masala Chai'].base_price,
            item_status: 'ready',
          },
          {
            menu_item_id: menuItemsByName['Banana Walnut Loaf']._id,
            item_name: 'Banana Walnut Loaf',
            quantity: 2,
            unit_price: menuItemsByName['Banana Walnut Loaf'].base_price,
            item_status: 'ready',
          },
        ],
        special_notes: 'Guests are in a hurry.',
      },
    ]);

    await Table.findByIdAndUpdate(tableIds.t1, {
      current_order_id: orders[0]._id,
      status: 'occupied',
    });

    await Table.findByIdAndUpdate(tableIds.t3, {
      current_order_id: orders[1]._id,
      status: 'occupied',
    });

    await OrderHistory.insertMany([
      {
        order_id: orders[0]._id,
        cafe_id: cafeId,
        changed_by: waiterId,
        action: 'created',
        details: { source: 'seed', table_number: 'T1' },
      },
      {
        order_id: orders[1]._id,
        cafe_id: cafeId,
        changed_by: waiterId,
        action: 'status_changed',
        status_change: { from: 'preparing', to: 'ready' },
        details: { source: 'seed', table_number: 'T3' },
      },
    ]);

    console.log('Seeded roles, demo users, categories, menu items, tables, and orders successfully');
    console.log('Demo admin: admin@flagshipcafe.com / Pass123!');
    console.log('Demo waiter: waiter@flagshipcafe.com / Pass123!');
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedInitialData();
