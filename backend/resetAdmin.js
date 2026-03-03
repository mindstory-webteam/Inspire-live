require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function reset() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected:', mongoose.connection.host);

  // Delete both if they exist
  await User.deleteMany({ email: { $in: ['superadmin@blog.com', 'admin@blog.com'] } });
  console.log('Old users deleted');

  // Create Super Admin
  await User.create({
    name: 'Super Admin',
    email: 'superadmin@blog.com',
    password: 'superadmin123',
    role: 'superadmin',
    isActive: true,
  });
  console.log('✅ Superadmin created: superadmin@blog.com / superadmin123');

  // Create Admin
  await User.create({
    name: 'Admin',
    email: 'admin@blog.com',
    password: 'admin123',
    role: 'admin',
    isActive: true,
  });
  console.log('✅ Admin created: admin@blog.com / admin123');

  await mongoose.disconnect();
  process.exit(0);
}

reset().catch(err => { console.error(err); process.exit(1); });