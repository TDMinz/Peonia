const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Booking = require('../models/booking.model');
const Workshop = require('../models/workshop.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

async function getDashboardStats(req, res) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalRevenueOrders,
      totalRevenueBookings,
      todayRevenueOrders,
      monthRevenueOrders,
      todayOrders,
      monthOrders,
      todayBookings,
      monthBookings,
      workshops,
      products,
      categories,
      topOrderItems,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$paid_amount' } } }]),
      Booking.aggregate([{ $group: { _id: null, total: { $sum: '$paid_amount' } } }]),
      Order.aggregate([
        { $match: { created_at: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: '$paid_amount' } } },
      ]),
      Order.aggregate([
        { $match: { created_at: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$paid_amount' } } },
      ]),
      Order.countDocuments({ created_at: { $gte: startOfToday } }),
      Order.countDocuments({ created_at: { $gte: startOfMonth } }),
      Booking.countDocuments({ created_at: { $gte: startOfToday } }),
      Booking.countDocuments({ created_at: { $gte: startOfMonth } }),
      Workshop.find().sort({ event_date: 1 }).select('title event_date max_slots available_slots price'),
      Product.countDocuments(),
      Category.countDocuments(),
      OrderItem.aggregate([
        {
          $group: {
            _id: '$product_id',
            quantity: { $sum: '$quantity' },
            revenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
        { $sort: { quantity: -1 } },
        { $limit: 5 },
      ]),
    ]);

    const formatAggTotal = (rows) => (rows[0]?.total || 0);

    return res.json({
      summary: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          confirmed: confirmedOrders,
          cancelled: cancelledOrders,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },
        revenue: {
          orders: formatAggTotal(totalRevenueOrders),
          bookings: formatAggTotal(totalRevenueBookings),
          today_orders: formatAggTotal(todayRevenueOrders),
          month_orders: formatAggTotal(monthRevenueOrders),
          total: formatAggTotal(totalRevenueOrders) + formatAggTotal(totalRevenueBookings),
        },
        counts: {
          workshops: workshops.length,
          products,
          categories,
        },
      },
      workshops: workshops.map((w) => ({
        id: w._id,
        title: w.title,
        event_date: w.event_date,
        max_slots: w.max_slots,
        available_slots: w.available_slots,
        booked_slots: Math.max(w.max_slots - w.available_slots, 0),
        occupancy_rate: w.max_slots ? Math.round(((w.max_slots - w.available_slots) / w.max_slots) * 100) : 0,
        price: w.price,
      })),
      activity: {
        today_orders,
        month_orders,
        today_bookings,
        month_bookings,
      },
      top_products: topOrderItems,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi lấy thống kê dashboard.', error: error.message });
  }
}

module.exports = {
  getDashboardStats,
};
