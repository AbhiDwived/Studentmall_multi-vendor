const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: String, required: true },
  address: { type: String },
  role: { type: String, required: true, enum: ['admin', 'user', 'seller'] },
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    
    const adminEmail = 'mernstudy791@gmail.com';
    const adminPassword = 'Abhi@1432';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await User.create({
      name: 'Abhi Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '01700000000',
      address: 'Bangladesh',
      role: 'admin'
    });
    
    console.log('Admin created successfully:', admin.email);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();