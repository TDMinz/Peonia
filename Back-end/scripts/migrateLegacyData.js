require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flower_shop_db';
const DB_NAME = process.env.MONGO_DB_NAME || 'flower_shop_db';

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

async function migrateOrders(db) {
  const orders = db.collection('orders');
  const orderItems = db.collection('order_items');
  const variants = db.collection('product_variants');

  const cursor = orders.find({});
  let updated = 0;

  while (await cursor.hasNext()) {
    const order = await cursor.next();
    const items = await orderItems.find({ order_id: order._id }).toArray();

    let subtotal = 0;
    for (const item of items) {
      let price = toNumber(item.price, 0);
    
      if (!price && item.product_id) {
        const product = await Product.findById(item.product_id);
    
        price = toNumber(
          product?.sale_price || product?.price,
          0
        );
      }
    
      subtotal += price * toNumber(item.quantity, 1);
    }

    const existingTotal = toNumber(order.total_price, subtotal);
    const total_price = existingTotal > 0 ? existingTotal : subtotal;
    const subtotal_price = toNumber(order.subtotal_price, subtotal);
    const deposit_amount = toNumber(order.deposit_amount, Math.round(total_price * 0.3));
    const paid_amount = toNumber(order.paid_amount, deposit_amount);
    const remaining_amount = Math.max(total_price - paid_amount, 0);
    const payment_status = order.payment_status || (paid_amount >= total_price ? 'paid' : 'partial_paid');

    await orders.updateOne(
      { _id: order._id },
      {
        $set: {
          subtotal_price,
          total_price,
          deposit_amount,
          paid_amount,
          remaining_amount,
          payment_status,
          status: order.status || 'pending',
        },
      }
    );
    updated += 1;
  }

  return updated;
}

async function migrateBookings(db) {
  const bookings = db.collection('bookings');
  const workshops = db.collection('workshops');

  const cursor = bookings.find({});
  let updated = 0;

  while (await cursor.hasNext()) {
    const booking = await cursor.next();
    const workshop = booking.workshop_id ? await workshops.findOne({ _id: booking.workshop_id }) : null;
    const total_price = toNumber(booking.total_price, toNumber(workshop?.price, 0) * toNumber(booking.seats_booked, 1));
    const deposit_amount = toNumber(booking.deposit_amount, Math.round(total_price * 0.3));
    const paid_amount = toNumber(booking.paid_amount, deposit_amount);
    const remaining_amount = Math.max(total_price - paid_amount, 0);
    const payment_status = booking.payment_status || (paid_amount >= total_price ? 'paid' : 'partial_paid');

    await bookings.updateOne(
      { _id: booking._id },
      {
        $set: {
          total_price,
          deposit_amount,
          paid_amount,
          remaining_amount,
          payment_status,
          status: booking.status || 'pending',
        },
      }
    );
    updated += 1;
  }

  return updated;
}

async function main() {
  const client = new mongoose.mongo.MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const ordersUpdated = await migrateOrders(db);
    const bookingsUpdated = await migrateBookings(db);

    console.log(`Migration completed.`);
    console.log(`Orders updated: ${ordersUpdated}`);
    console.log(`Bookings updated: ${bookingsUpdated}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
