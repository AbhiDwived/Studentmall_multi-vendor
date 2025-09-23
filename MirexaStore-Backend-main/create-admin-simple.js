require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');
    
    const adminEmail = 'abhideivedi687@gmail.com';
    const adminPassword = 'Abhi@1432';
    
    const existingAdmin = await users.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    await users.insertOne({
      name: 'Abhi Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '01700000000',
      address: 'India',
      role: 'admin'
    });
    
    console.log('Admin created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createAdmin();