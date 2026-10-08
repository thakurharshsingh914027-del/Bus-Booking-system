const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash('admin123', 10);
  await db.collection('users').updateOne({ email: 'admin@platform.com' }, { $set: { password: hash } });
  console.log('Password reset to admin123');
  process.exit(0);
});

