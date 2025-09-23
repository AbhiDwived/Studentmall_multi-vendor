require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const users = db.collection('users');
    
    const adminEmail = 'mernstudy791@gmail.com';
    const adminPassword = 'Abhi@1432';
    
    // Delete existing admin if exists
    await users.deleteOne({ email: adminEmail });
    console.log('Deleted existing admin if any');
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await users.insertOne({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      phone: '01700000000',
      address: 'India',
      role: 'admin'
    });
    
    console.log('Admin created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Admin ID:', admin.insertedId);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin();