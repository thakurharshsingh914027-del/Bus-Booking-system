const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('transport_booking_db');
  const users = await db.collection('users').find({ $or: [{phone: ''}, {phone: '+91'}, {phone: '91'}] }).toArray();
  console.log(users);
  await client.close();
}
run().catch(console.dir);

