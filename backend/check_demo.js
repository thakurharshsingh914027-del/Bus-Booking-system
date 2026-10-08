const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('transport_booking_db');
  const users = await db.collection('users').find({ name: { $regex: 'demo', $options: 'i' } }).toArray();
  console.log(JSON.stringify(users, null, 2));
  await client.close();
}
run().catch(console.dir);

