require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function createSeller() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');
    
    const sellerEmail = 'abhideivedi687@gmail.com';
    const sellerPassword = 'Abhi@1432';
    
    const existingSeller = await users.findOne({ email: sellerEmail });
    if (existingSeller) {
      console.log('User already exists, updating role to seller...');
      await users.updateOne(
        { email: sellerEmail },
        { $set: { role: 'seller' } }
      );
      console.log('User role updated to seller');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(sellerPassword, 12);
    
    await users.insertOne({
      name: 'Abhi Seller',
      email: sellerEmail,
      password: hashedPassword,
      phone: '01700000000',
      address: 'India',
      role: 'seller'
    });
    
    console.log('Seller created successfully!');
    console.log('Email:', sellerEmail);
    console.log('Password:', sellerPassword);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

createSeller();