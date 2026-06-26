require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flower_shop_db';
const DB_NAME = process.env.MONGO_DB_NAME || 'flower_shop_db';

async function rollbackOrders(db) {
  const orders = db.collection('orders');
  const result = await orders.updateMany(
    {},
    {
      $unset: {
        subtotal_price: '',
        deposit_amount: '',
        paid_amount: '',
        remaining_amount: '',
        payment_status: '',
      },
    }
  );
  return result.modifiedCount || 0;
}

async function rollbackBookings(db) {
  const bookings = db.collection('bookings');
  const result = await bookings.updateMany(
    {},
    {
      $unset: {
        deposit_amount: '',
        paid_amount: '',
        remaining_amount: '',
        payment_status: '',
      },
    }
  );
  return result.modifiedCount || 0;
}

async function main() {
  const client = new mongoose.mongo.MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const ordersUpdated = await rollbackOrders(db);
    const bookingsUpdated = await rollbackBookings(db);

    console.log('Rollback completed.');
    console.log(`Orders updated: ${ordersUpdated}`);
    console.log(`Bookings updated: ${bookingsUpdated}`);
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
