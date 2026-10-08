const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('transport_booking_db');
  
  const cleanId = '+919844556677';
  const digits = cleanId.replace(/\D/g, '');
  const last10 = digits.length >= 10 ? digits.slice(-10) : digits;
  const orConditions = [
    { phone: cleanId },
    { phone: `+91${last10}` },
    { phone: `91${last10}` },
    { phone: last10 },
    { email: cleanId.toLowerCase() }
  ];
  if (last10.length >= 7) {
    orConditions.push({ phone: { $regex: new RegExp(last10 + '$') } });
  }

  const users = await db.collection('users').find({ $or: orConditions }).toArray();
  console.log(JSON.stringify(users, null, 2));
  await client.close();
}
run().catch(console.dir);

